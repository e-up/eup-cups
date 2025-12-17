export * from "./ipp/client";
export * from "./ipp/ops";
export * from "./cups/ops";
export * from "./cups/client";

import { IPPResponse } from 'eup-ipp-encoder';

/**
 * 将 IPPResponse 扁平化，使属性更易于访问
 * 保持IPP协议本身的结构，只做格式化处理
 */
export function flattenIppResponse(response: IPPResponse): Record<string, any> {
    const result: Record<string, any> = {
        version: response.version,
        statusCode: response.statusCode,
        requestId: response.requestId,
        groups: {} as Record<string, any | Array<Record<string, any>>>
    };

    if (!response.groups) return result;

    for (const group of response.groups) {
        if (!group.attributes) continue;

        // 获取组标签，直接使用原始标签值
        const tag = (group as any).tag || 0;
        const groupName = String(tag);
        
        // 创建当前组的属性对象
        const groupAttrs: Record<string, any> = {};
        
        for (const attr of group.attributes) {
            const name = attr.name;
            // 处理值 - 确保单个值不是数组
            const value = Array.isArray(attr.value)
                ? attr.value.length === 1 ? attr.value[0] : attr.value
                : attr.value;

            // 存储当前组的属性
            groupAttrs[name] = value;
        }
        
        // 按分组存储的属性 - 处理重复tag的情况
        if (!result.groups[groupName]) {
            // 如果是第一个该tag的组，直接存储
            result.groups[groupName] = groupAttrs;
        } else if (Array.isArray(result.groups[groupName])) {
            // 如果已经是数组，添加新的组
            (result.groups[groupName] as Array<Record<string, any>>).push(groupAttrs);
        } else {
            // 如果已经是单个对象，转为数组
            result.groups[groupName] = [result.groups[groupName] as Record<string, any>, groupAttrs];
        }
    }

    return result;
}

/**
 * 将扁平化的 IPPResponse 转换为可读的字符串
 */
export function formatIppResponse(response: IPPResponse): string {
    const flattened = flattenIppResponse(response);

    let output = `IPP Response\n`;
    output += `├── Version: ${flattened.version.major}.${flattened.version.minor}\n`;
    output += `├── Status Code: ${flattened.statusCode}\n`;
    output += `├── Request ID: ${flattened.requestId}\n`;

    // 添加分组信息显示
    if (Object.keys(flattened.groups).length > 0) {
        output += `└── Groups:\n`;

        for (const [groupName, groupValue] of Object.entries(flattened.groups)) {
            if (Array.isArray(groupValue)) {
                // 处理数组类型的组（例如多个打印机）
                output += `    └── ${groupName} [${groupValue.length} items]:\n`;
                
                groupValue.forEach((groupItem, index) => {
                    output += `        ├── Item ${index + 1}:\n`;
                    
                    for (const [attrName, attrValue] of Object.entries(groupItem as Record<string, any>)) {
                        const formattedValue = Array.isArray(attrValue) ? attrValue.join(', ') : String(attrValue);
                        output += `            ├── ${attrName}: ${formattedValue}\n`;
                    }
                });
            } else {
                // 处理单个对象类型的组
                output += `    └── ${groupName}:\n`;

                for (const [attrName, attrValue] of Object.entries(groupValue as Record<string, any>)) {
                    const formattedValue = Array.isArray(attrValue) ? attrValue.join(', ') : String(attrValue);
                    output += `        ├── ${attrName}: ${formattedValue}\n`;
                }
            }
        }
    }

    return output;
}
