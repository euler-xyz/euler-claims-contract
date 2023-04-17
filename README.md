# EulerClaims

This smart contract implements a mechanism for users protocol to redeem funds that were stolen during the 2023-03-13 hack of the Euler protocol and subsequently recovered.

It is a merkle-tree based distributor contract that can be used by both EOAs and multi-sig wallets. Neither the actual claimable amounts nor the code to calculate the distribution is stored in this repository.

## Audits

* [OtterSec](https://github.com/euler-xyz/euler-claims-contract/blob/master/audits/ottersec_euler_claims_audit_draft.pdf)
* [Zellic](https://github.com/euler-xyz/euler-claims-contract/blob/master/audits/zellic_audit_report.pdf)

## Deployments

* [MerkleDist1](https://etherscan.io/address/0xbc8021015db2ca0599e0692d63ae6b91564cf026)

## Terms and Conditions

By clicking "I agree to the terms to claim redemption" on the euler.finance web interface or executing the EulerClaims smart contract and accepting the redemption, I hereby irrevocably and unconditionally release all claims I (or my company or other separate legal entity) may have against Euler Labs, Ltd., the Euler Foundation, the Euler Decentralized Autonomous Organization, members of the Euler Decentralized Autonomous Organization, and any of their agents, affiliates, officers, employees, or principals related to this matter, whether such claims are known or unknown at this time and regardless of how such claims arise and the laws governing such claims (which shall include but not be limited to any claims arising out of Euler’s terms of use).  This release constitutes an express and voluntary binding waiver and relinquishment to the fullest extent permitted by law.  If I am acting for or on behalf of a company (or other such separate entity), by clicking "I agree to the terms to claim redemption" on the euler.finance web interface or executing the EulerClaims smart contract and accepting the redemption and agreement, I confirm that I am duly authorised to enter into this contract on its behalf.

This agreement and all disputes relating to or arising under this agreement (including the interpretation, validity or enforcement thereof) will be governed by and subject to the laws of England and Wales and the courts of London, England shall have exclusive jurisdiction to determine any such dispute.  To the extent that the terms of this release are inconsistent with any previous agreement and/or Euler’s terms of use, I accept that these terms take priority and, where necessary, replace the previous terms.
