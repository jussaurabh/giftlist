const express = require("express");
const verifyProof = require("../utils/verifyProof");
const MerkleTree = require("../utils/MerkleTree");
const niceList = require("../utils/niceList.json");

const port = 1225;

const app = express();
app.use(express.json());

const merkleTree = new MerkleTree(niceList);
const MERKLE_ROOT = merkleTree.getRoot();

app.post("/gift", (req, res) => {
	const body = req.body;
	const index = niceList.findIndex((n) => n === body.name);

	const proof = merkleTree.getProof(index);

	const isInTheList = verifyProof(proof, body.name, MERKLE_ROOT);
	if (isInTheList) {
		res.send("You got a toy robot!");
	} else {
		res.send(`You are not on the list :(`);
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
