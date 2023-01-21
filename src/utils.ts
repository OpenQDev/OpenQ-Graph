import { Bytes, BigInt } from '@graphprotocol/graph-ts'

export const addTuplePrefix = (data: Bytes): Bytes => {
	const tuplePrefix = '0x0000000000000000000000000000000000000000000000000000000000000020';
	const no0xParams = data.toHexString().substring(2);
	const withTuplePrefix = tuplePrefix.concat(no0xParams);
	const prefixedData = Bytes.fromHexString(withTuplePrefix);
	return prefixedData
}

export default class Constants {
	constructor () { }

	static get VERSION_1(): string {
		return '1';
	}

	static get OPEN(): BigInt {
		return BigInt.fromString("0")
	}
	
	static get CLOSED(): BigInt {
		return BigInt.fromString("1")
	}

	static get ATOMIC(): BigInt {
		return BigInt.fromString('0')
	}

	static get ONGOING(): BigInt {
		return BigInt.fromString('1')
	}

	static get TIERED(): BigInt {
		return BigInt.fromString('2')
	}

	static get TIERED_FIXED(): BigInt {
		return BigInt.fromString('3')
	}
}