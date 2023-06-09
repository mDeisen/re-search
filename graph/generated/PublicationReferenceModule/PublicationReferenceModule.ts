// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Publish extends ethereum.Event {
  get params(): Publish__Params {
    return new Publish__Params(this);
  }
}

export class Publish__Params {
  _event: Publish;

  constructor(event: Publish) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get pubId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get citeIds(): Array<BigInt> {
    return this._event.parameters[2].value.toBigIntArray();
  }

  get title(): string {
    return this._event.parameters[3].value.toString();
  }
}

export class Review extends ethereum.Event {
  get params(): Review__Params {
    return new Review__Params(this);
  }
}

export class Review__Params {
  _event: Review;

  constructor(event: Review) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get profileIdPointed(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get pubIdPointed(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get accepted(): boolean {
    return this._event.parameters[3].value.toBoolean();
  }
}

export class PublicationReferenceModule extends ethereum.SmartContract {
  static bind(address: Address): PublicationReferenceModule {
    return new PublicationReferenceModule(
      "PublicationReferenceModule",
      address
    );
  }

  HUB(): Address {
    let result = super.call("HUB", "HUB():(address)", []);

    return result[0].toAddress();
  }

  try_HUB(): ethereum.CallResult<Address> {
    let result = super.tryCall("HUB", "HUB():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  hIndexOf(profileId: BigInt): BigInt {
    let result = super.call("hIndexOf", "hIndexOf(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(profileId)
    ]);

    return result[0].toBigInt();
  }

  try_hIndexOf(profileId: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall("hIndexOf", "hIndexOf(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(profileId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  initializeReferenceModule(
    profileId: BigInt,
    pubId: BigInt,
    data: Bytes
  ): Bytes {
    let result = super.call(
      "initializeReferenceModule",
      "initializeReferenceModule(uint256,uint256,bytes):(bytes)",
      [
        ethereum.Value.fromUnsignedBigInt(profileId),
        ethereum.Value.fromUnsignedBigInt(pubId),
        ethereum.Value.fromBytes(data)
      ]
    );

    return result[0].toBytes();
  }

  try_initializeReferenceModule(
    profileId: BigInt,
    pubId: BigInt,
    data: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "initializeReferenceModule",
      "initializeReferenceModule(uint256,uint256,bytes):(bytes)",
      [
        ethereum.Value.fromUnsignedBigInt(profileId),
        ethereum.Value.fromUnsignedBigInt(pubId),
        ethereum.Value.fromBytes(data)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get hub(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class InitializeReferenceModuleCall extends ethereum.Call {
  get inputs(): InitializeReferenceModuleCall__Inputs {
    return new InitializeReferenceModuleCall__Inputs(this);
  }

  get outputs(): InitializeReferenceModuleCall__Outputs {
    return new InitializeReferenceModuleCall__Outputs(this);
  }
}

export class InitializeReferenceModuleCall__Inputs {
  _call: InitializeReferenceModuleCall;

  constructor(call: InitializeReferenceModuleCall) {
    this._call = call;
  }

  get profileId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get pubId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class InitializeReferenceModuleCall__Outputs {
  _call: InitializeReferenceModuleCall;

  constructor(call: InitializeReferenceModuleCall) {
    this._call = call;
  }

  get value0(): Bytes {
    return this._call.outputValues[0].value.toBytes();
  }
}

export class ProcessCommentCall extends ethereum.Call {
  get inputs(): ProcessCommentCall__Inputs {
    return new ProcessCommentCall__Inputs(this);
  }

  get outputs(): ProcessCommentCall__Outputs {
    return new ProcessCommentCall__Outputs(this);
  }
}

export class ProcessCommentCall__Inputs {
  _call: ProcessCommentCall;

  constructor(call: ProcessCommentCall) {
    this._call = call;
  }

  get profileId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get profileIdPointed(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get pubIdPointed(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class ProcessCommentCall__Outputs {
  _call: ProcessCommentCall;

  constructor(call: ProcessCommentCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetRequireHIndexFlagCall extends ethereum.Call {
  get inputs(): SetRequireHIndexFlagCall__Inputs {
    return new SetRequireHIndexFlagCall__Inputs(this);
  }

  get outputs(): SetRequireHIndexFlagCall__Outputs {
    return new SetRequireHIndexFlagCall__Outputs(this);
  }
}

export class SetRequireHIndexFlagCall__Inputs {
  _call: SetRequireHIndexFlagCall;

  constructor(call: SetRequireHIndexFlagCall) {
    this._call = call;
  }

  get enabled(): boolean {
    return this._call.inputValues[0].value.toBoolean();
  }
}

export class SetRequireHIndexFlagCall__Outputs {
  _call: SetRequireHIndexFlagCall;

  constructor(call: SetRequireHIndexFlagCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}
