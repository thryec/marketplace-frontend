import { useState } from "react";
import { useHistory } from "react-router-dom";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { nftaddress, marketplaceaddress } from "./config";
import NFT from "./contract-abis/NFT.json";
import Market from "./contract-abis/Marketplace.json";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

const Gallery = () => {
  const [myNFTs, setMyNFTs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [listPrice, setListPrice] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();

  const fetchMyNFTs = async () => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer);
    const marketplaceContract = new ethers.Contract(
      marketplaceaddress,
      Market.abi,
      signer
    );

    const data = await marketplaceContract.getItemsOwned();

    const items = await Promise.all(
      data.map(async (el) => {
        const tokenURI = await nftContract.getTokenURI(el.tokenId);
        const res = await fetch(tokenURI);
        const data = await res.json();
        let price = ethers.utils.formatUnits(el.price.toString(), "ether");
        let item = {
          price,
          tokenId: el.tokenId.toNumber(),
          itemId: el.itemId.toNumber(),
          seller: el.seller,
          owner: el.owner,
          listed: el.isListed,
          image: data.image,
          name: data.name,
          description: data.description,
        };
        return item;
      })
    );
    setMyNFTs(items);
    setIsLoaded(true);
  };

  const listItem = async (nft) => {
    if (isNaN(listPrice) | (listPrice === null)) {
      alert("Please input a valid integer value.");
    } else {
      setIsPending(true);
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer);
      const marketplaceContract = new ethers.Contract(
        marketplaceaddress,
        Market.abi,
        signer
      );

      console.log("listing item with Id ", nft.itemId, "....");
      const price = ethers.utils.parseUnits(listPrice, "ether");
      const approval = await nftContract.setApprovalForAll(
        marketplaceaddress,
        true
      );
      const approvetxn = await approval.wait();
      console.log("marketplace approved: ", approvetxn);
      const listing = await marketplaceContract.relistItem(
        nftaddress,
        nft.itemId,
        price
      );
      const txn = await listing.wait();
      console.log("item listed: ", txn);
      setModalActive(false);
      setIsPending(false);
      history.push("/");
    }
  };

  const renderNFTs = myNFTs.map((el, i) => {
    return (
      <Card sx={{ width: 275 }} key={i}>
        <CardMedia
          component="img"
          height="300"
          image={el.image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {el.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {el.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => {
              setModalActive(true);
            }}
            size="small"
          >
            List
          </Button>
        </CardActions>
        <Modal
          open={modalActive}
          onClose={() => {
            setModalActive(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={bgStyle}
        >
          <Box sx={modalStyle}>
            <Stack direction="column" spacing={4} alignItems="center">
              <Typography id="modal-modal-title" variant="h4">
                Enter List Price
              </Typography>
              <TextField
                onChange={(e) => {
                  setListPrice(e.target.value);
                }}
                label="List Price"
              />
              <Button
                onClick={() => {
                  listItem(el);
                }}
                variant="contained"
              >
                Approve & List on Marketplace
              </Button>
              {isPending && (
                <Box>
                  <p>Please wait while your transaction is being mined...</p>
                  <CircularProgress />
                </Box>
              )}
            </Stack>
          </Box>
        </Modal>
      </Card>
    );
  });

  // useEffect(() => {
  //     fetchMyNFTs()
  // }, [])

  return isLoaded ? (
    <div style={bodyStyle}>
      <Stack direction="row" spacing={2}>
        {myNFTs.length === 0 ? <p>No Items Owned </p> : renderNFTs}
      </Stack>
    </div>
  ) : (
    <div style={bodyStyle}>
      <Button onClick={fetchMyNFTs} variant="contained">
        Connect Wallet
      </Button>
    </div>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 400,
  backgroundColor: "background.paper",
  border: "3px solid #aaa",
  borderRadius: "5%",
  boxShadow: 24,
  p: 4,
  "& .MuiTextField-root": { width: "40ch" },
};

const bgStyle = {
  backgroundColor: "#ffffff",
};

const bodyStyle = {
  margin: 50,
};

export default Gallery;
