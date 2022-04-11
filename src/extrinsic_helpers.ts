import {
  EventHandlerContext,
  ExtrinsicHandlerContext,
} from "@subsquid/substrate-processor";
import { TreasuryProposeSpendCall } from "./types/calls";
import { MultiAddress } from './types/v9110'
import { GenericMultiAddress } from './types/v28'

export function getProposedSpendExtrinsic(ctx: EventHandlerContext): ProposedSpend {
  if (!ctx.extrinsic) {
    throw new MissingExtrinsicError("missing extrinsic information");
  }
  let exctx: ExtrinsicHandlerContext = ctx as ExtrinsicHandlerContext;

  const extrinsic = new TreasuryProposeSpendCall(exctx);

  if (extrinsic.isV0) {
    let { value, beneficiary } = extrinsic.asV0;
    return { value, beneficiaryId : beneficiary };
  }
  if (extrinsic.isV28) {
    let { value, beneficiary } = extrinsic.asV28;
    if (beneficiary.__kind == "Index") throw new Error("Wrong Account address")
    const beneficiaryId = beneficiary.value
    
    return { value, beneficiaryId };
  }
  if (extrinsic.isV9110) {
    const { value, beneficiary } = extrinsic.asV9110;
    if (beneficiary.__kind == "Index") throw new Error("Wrong Accunt address")
    const beneficiaryId = beneficiary.value
    
    return { value, beneficiaryId };
  }
  throw new Error("No Runtime version found");
}

export interface ProposedSpend {
  value: bigint;
  beneficiaryId: Uint8Array;
}

export class MissingExtrinsicError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MissingExtrinsicError.prototype);
  }

  sayHello() {
    return "hello " + this.message;
  }
}
