# Flexrp - Flare / XRP Account Setup Tool

This application will setup a XRP account for the Flare Spark token airdrop.

(C) 2020 - Dev Null Productions <devnullproductions@gmail.com>

## Installation

...

## Warning

**THIS TOOL REQUIRES ACCESS TO YOUR SECRET XRP KEY, ONLY RUN IT ON A SECURE SYSTEM**

Flexrp is 100% open source and auditable. Every effort has been made to make the code as transparent and easy to read and understand as possible.

While by default this tool runs in *online* mode, submitting the command to setup your wallet directly to the XRP ledger, it can be configured to run in *offline* mode for further security. See *settings* below

## Usage

Flexrp works via a simple one step process where you specify the secret key to your XRP account and the public address of the ETH wallet to associate with it.

If you do not have an existing Ethereum wallet, this tool will allow you to create one on the fly.

**IF YOU CREATE AN ETHEREUM WALLET, MAKE SURE TO STORE THE PRIVATE KEY. IT WILL NOT BE RECOVERABLE ONCE THE WINDOW IS CLOSED.**

To start launch the application and confirm you are running on a secure system:

![Security Check](screenshots/secure-system.png)

Optionally click the settings icon in the upper right to configure application settings (see *settings* below).

![Settings](screenshots/settings-control.png)
![Settings](screenshots/settings-window.png)

Enter your XRP secret key here:

![XRP Secret](screenshots/xrp-secret-input.png)

Click the *eye icon* to view / hide your XRP secret key.

Enter your ETH public address here:

![Eth Address](screenshots/eth-address-input.png)

Click the **+** icon to create a new ETH wallet, the existing one (if any) will be replaced. 

Finally click *Submit* to setup your account.

![Submit](screenshots/submit-tx.png)

If operating in *offline* mode, you will be provided the XRP transaction to setup your account.

**YOU MUST SUBSEQUENTLY SUBMIT THIS TRANSACTION FOR IT TO TAKE EFFECT. THE SCOPE OF THIS IS OUTSIDE THIS TOOL**

![Signed Tx](screenshots/signed-tx.png)

If operation in *online* mode (default), the transaction will automatically submitted and confirmation presented.

You are now done! You will receive Flare Spark tokens on the date of the airdrop!

## Settings

Application settings can be configured by clicking the gears icons in the upper right.

- **Connect to testnet** - The XRPL testnet will be used instead of the mainnet. Read more about this [here](https://xrpl.org/parallel-networks.html)

- **Offline mode** - Flexrp will **not** connect to any XRP server and instead simply generate and sign a transaction for subsequent submission to the network. **YOU MUST INDEPENDENTLY SUBMIT THE PRODUCED TRANSACTION TO RECEIVE FLARE TOKENS**.

When in offline mode, you will be required to configure a few more parameters to successfully be able to generate a XRP transaction. These are:

- **Fee** - the amount of XRP to pay in fees
- **Sequence** - the sequence number to assign to the transaction
- **Max Ledger Version** - the highest ledger number which this transaction can be included in

Read more about these options [here](https://xrpl.org/rippleapi-reference.html#transaction-instructions).

## Legaleeze

This application provides with no warranties or guarantees pertaining to functionality or use. Make sure you know what you are doing and the risks involved with managing cryptocurrencies before using this application. By using this application you agree to absolve Dev Null Productions of any liabilities that may arise.
