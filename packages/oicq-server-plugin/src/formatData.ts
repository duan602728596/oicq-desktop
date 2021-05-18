import type { MemberInfo } from 'oicq';
import type { InfoItem, GmlItem } from './types';

// 处理数据
export function formatList<T = InfoItem>(data: Map<number, T>): Array<T> {
  const array: Array<[number, T]> = Array.from(data);

  return array.map((o: [number, T]): T => o[1]);
}

// 处理群员列表
export function formatGml(data: Map<number, Map<number, MemberInfo>>): Array<GmlItem> {
  const array: Array<[number, Map<number, MemberInfo>]> = Array.from(data);

  return array.map((o: [number, Map<number, MemberInfo>]): GmlItem => [o[0], formatList<MemberInfo>(o[1])]);
}