import { Bytes, BigInt, Address, ethereum } from "@graphprotocol/graph-ts";
import { InvoiceCompleteSet } from "../generated/OpenQ/OpenQ";
import {
  newMockEvent,
  test,
  assert,
  clearStore,
  afterEach,
  describe,
  beforeEach,
} from "matchstick-as/assembly/index";
import { handleInvoiceCompleteSet } from "../src/mapping";
import { seedBounty } from "./utils";
import Constants from "./constants";

describe("handleInvoiceCompleteSet.test", () => {
  beforeEach(() => {
    seedBounty();
  });

  afterEach(() => {
    clearStore();
  });

  test("can handle invoiceCompleted set event - ATOMIC", () => {
    let newInvoiceCompleteSetEvent = createNewInvoiceCompleteSetEvent(
      Constants.id,
      Constants.bountyType_ATOMIC,
      Constants.invoiceCompletedData_ATOMIC,
      Constants.VERSION_1
    );

    let newInvoiceCompleteSetEvent_false = createNewInvoiceCompleteSetEvent(
      Constants.id,
      Constants.bountyType_ATOMIC,
      Constants.invoiceCompletedData_ATOMIC_false,
      Constants.VERSION_1
    );

    newInvoiceCompleteSetEvent.transaction.hash = Bytes.fromHexString(
      Constants.transactionHash
    );
    newInvoiceCompleteSetEvent.transaction.from = Address.fromString(
      Constants.userId
    );

    handleInvoiceCompleteSet(newInvoiceCompleteSetEvent);

    // NOTE: This is super space, case and comma-sensitive
    assert.fieldEquals("Bounty", Constants.id, "invoiceCompleted", `[true]`);
    handleInvoiceCompleteSet(newInvoiceCompleteSetEvent_false);
    assert.fieldEquals("Bounty", Constants.id, "invoiceCompleted", "null");
  });

  test("can handle invoiceCompleted set event - TIERED", () => {
    let newInvoiceCompleteSetEvent = createNewInvoiceCompleteSetEvent(
      Constants.id,
      Constants.bountyType_TIERED,
      Constants.invoiceCompletedData_TIERED,
      Constants.VERSION_1
    );

    newInvoiceCompleteSetEvent.transaction.hash = Bytes.fromHexString(
      Constants.transactionHash
    );
    newInvoiceCompleteSetEvent.transaction.from = Address.fromString(
      Constants.userId
    );

    handleInvoiceCompleteSet(newInvoiceCompleteSetEvent);

    // NOTE: This is super space, case and comma-sensitive
    assert.fieldEquals(
      "Bounty",
      Constants.id,
      "invoiceCompleted",
      `[${Constants.invoiceCompleted[0]}, ${Constants.invoiceCompleted[1]}, ${Constants.invoiceCompleted[2]}]`
    );
  });
});

export function createNewInvoiceCompleteSetEvent(
  bountyAddress: string,
  bountyType: string,
  data: string,
  version: string
): InvoiceCompleteSet {
  let newInvoiceCompleteSetEvent = changetype<InvoiceCompleteSet>(
    newMockEvent()
  );

  let parameters: Array<ethereum.EventParam> = [
    new ethereum.EventParam(
      "bountyAddress",
      ethereum.Value.fromAddress(Address.fromString(bountyAddress))
    ),
    new ethereum.EventParam(
      "bountyType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))
    ),
    new ethereum.EventParam(
      "data",
      ethereum.Value.fromBytes(Bytes.fromHexString(data))
    ),
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version))
    ),
  ];

  newInvoiceCompleteSetEvent.parameters = parameters;

  return newInvoiceCompleteSetEvent;
}
