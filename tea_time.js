abi =
[
	{
		"constant": true,
		"inputs": [
			{
				"name": "candidate",
				"type": "string"
			}
		],
		"name": "totalVotesFor",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "candidate",
				"type": "string"
			}
		],
		"name": "validCandidate",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "candidate",
				"type": "string"
			}
		],
		"name": "votesReceived",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidateList",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "candidate",
				"type": "string"
			}
		],
		"name": "voteForCandidate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "candidateNames",
				"type": "string[]"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
]
address ='0x7C291E2F63487F95E0223605076B7c94eCf27C97';
ethereum.request({ method: 'eth_accounts' }).then(result => myMetaMaskWallet = result);

const INFURA_API_KEY = 'd339e6283f2e42f2a9bce4028fc7f677';
web3_sepolia = new Web3(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
mygasprice = web3_sepolia.utils.toWei('4', 'Gwei'); //把16 Gwei轉換成 wei
// 查詢測試鏈Ｇoerli 的即時gas price可以連上網站 https://stats.goerli.net/ 查詢

web3js= new Web3(ethereum);
myContract = new web3_sepolia.eth.Contract(abi,address);
mymetamaskContract = new web3js.eth.Contract(abi,address);

candidates = {'薯條': 'candidate-1', '漢堡': 'candidate-2', '可樂': 'candidate-3'}

function voteForCandidate() {
  candidateName = $('#candidate').val();
  console.log(candidateName);
  mymetamaskContract.methods.voteForCandidate(candidateName).send({from: myMetaMaskWallet[0]}).then(console.log);
  }

function sendETH() {
    receiverAddress = address;
    sendAmount = web3_sepolia.utils.toWei('0', 'ether');
    senderPrivateKey = document.getElementById('senderPrivateKey').value;
    obj1=web3_sepolia.eth.accounts.privateKeyToAccount(senderPrivateKey);
    senderAddress = Object.values(obj1);
	candidateName = $('#candidate').val();
	console.log('candidate: ' + candidateName);
	hexdata = web3_sepolia.eth.abi.encodeFunctionCall(abi[0],[candidateName]);
    // hexdata = document.getElementById('send_data').value;
	console.log('hexdata: ' + hexdata);
    console.log('收款地址:' + receiverAddress);
    console.log('發送方地址:' + senderAddress[0]);
    console.log('轉帳數量:' + sendAmount + 'wei');
    web3_sepolia.eth.accounts.signTransaction({
        to: receiverAddress,
        value: sendAmount,
        chainId: 11155111,
        nonce: web3_sepolia.eth.getTransactionCount(senderAddress[0]),
        gasPrice: mygasprice,
        data:hexdata,
        gas: 70000},
        senderPrivateKey,
        (err, resolved) => {
         temp = Object.values(resolved);
         signedRawData=temp[4];
        //  console.log('signedRawData:' + signedRawData);
         web3_sepolia.eth.sendSignedTransaction(signedRawData,
            (e,success)=>{
                console.log(success);
                // document.getElementById('tx_hash').value = success;
                console.log('交易成功,交易哈希值為:' + success);
				console.log('https://sepolia.etherscan.io/tx/' + success);
            });
        }
    );

			web3_sepolia.eth.getTransactionCount(senderAddress[0],
            (err, resolved) => {
            req_times=resolved;
            console.log("這是發送者地址所發起的第：" + (req_times+1) + "筆的交易");
            }
        );
}



loop=()=>{
    let candidateNames = Object.keys(candidates);
    for (let name of candidateNames) {
        myContract.methods.totalVotesFor(name).call().
        then(result => {totalvotes = result;
        $(`#${candidates[name]}`).html(totalvotes);
        });
      }
    setTimeout(loop,1000);
  }
loop()