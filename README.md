# EulerClaims

This smart contract implements a mechanism for users protocol to redeem funds that were stolen during the 2023-03-13 hack of the Euler protocol and subsequently recovered.

It is a merkle-tree based distributor contract that can be used by both EOAs and multi-sig wallets. Neither the actual claimable amounts nor the code to calculate the distribution is stored in this repository.

## Audits

* [OtterSec](https://github.com/euler-xyz/euler-claims-contract/blob/master/audits/ottersec_euler_claims_audit_draft.pdf)
* [Zellic](https://github.com/euler-xyz/euler-claims-contract/blob/master/audits/zellic_audit_report.pdf)

## Deployments

* [MerkleDist1](https://etherscan.io/address/0xbc8021015db2ca0599e0692d63ae6b91564cf026)
* [MerkleDist2](https://etherscan.io/address/0xB4efe9d18696915523EF386e763070F0d5FE865f)
* [MerkleDist3](https://etherscan.io/address/0x4DDce44ab524F49b4050D9d59D7cF61cDa865F84)

## Terms and Conditions

By signing this Release, clicking "I Agree" on the web interface at euler.finance or executing the EulerClaims smart contract and accepting the redemption, I and any protocol I represent hereby irrevocably and unconditionally release all claims I and any protocol I represent (or other separate related or affiliated legal entities) ("Releasing Parties") may have against Euler Labs, Ltd., the Euler Foundation, the Euler Decentralized Autonomous Organization, members of the Euler Decentralized Autonomous Organization, and any of their agents, affiliates, officers, employees, or principals ("Released Parties") related to this matter whether such claims are known or unknown at this time and regardless of how such claims arise and the laws governing such claims (which shall include but not be limited to any claims arising out of Euler's terms of use).  This release constitutes an express and voluntary binding waiver and relinquishment to the fullest extent permitted by law.  Releasing Parties further agree to indemnify the Released Parties from any and all third-party claims arising or related to this matter, including damages, attorneys fees, and any other costs related to those claims.  If I am acting for or on behalf of a company (or other such separate related or affiliated legal entity), by signing this Release, clicking "I Agree" on the web interface at euler.finance or executing the EulerClaims smart contract and accepting the redemption, I confirm that I am duly authorised to enter into this contract on its behalf.

This agreement and all disputes relating to or arising under this agreement (including the interpretation, validity or enforcement thereof) will be governed by and subject to the laws of England and Wales and the courts of London, England shall have exclusive jurisdiction to determine any such dispute.  To the extent that the terms of this release are inconsistent with any previous agreement and/or Euler's terms of use, I accept that these terms take priority and, where necessary, replace the previous terms.
