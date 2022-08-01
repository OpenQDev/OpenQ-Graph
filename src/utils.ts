import { Bytes } from '@graphprotocol/graph-ts'

export const tuplify = (data: Bytes): Bytes => {
	const tuplePrefix = '0x0000000000000000000000000000000000000000000000000000000000000020';
	const no0xParams = data.toHexString().substring(2);
	const withTuplePrefix = tuplePrefix.concat(no0xParams);
	const prefixedData = Bytes.fromHexString(withTuplePrefix);
	return prefixedData
}