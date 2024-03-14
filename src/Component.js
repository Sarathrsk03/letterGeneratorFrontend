import React, { useState } from "react";

// import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo from "./logo.jpg"; // Import your logo image
import { Letter } from "./Letter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { v4 as uuidv4 } from "uuid";
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "3xl",
    margin: "auto",
    padding: theme.spacing(8),
  },
  title: {
    fontSize: "3xl",
    fontWeight: "bold",
  },
  subtitle: {
    color: theme.palette.text.secondary,
  },
  formControl: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(2),
  },
  selectContainer: {
    display: "flex",
    alignItems: "flex-end",
    gap: theme.spacing(2),
  },
  keywordContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  logo: {
    marginRight: theme.spacing(2),
    height: "50px", // Adjust the height as needed
  },
}));

export default function Component() {
  const classes = useStyles();
  const [uuid, setUUID] = useState("");
  const [formData, setFormData] = useState({
    uuid: "",
    senderdesig: "",
    senderName: "",
    senderAddress: "",
    sendercity: "",
    senderstate: "",
    sendercountry: "",
    receiverdesig: "",
    recipientName: "",
    recipientAddress: "",
    receivercity: "",
    receiverstate: "",
    receivercountry: "",
    date: "",
    subject: "",
    // subject: "",
    keywords: [null], // keywords as an array
  });

  const generateUUID = () => {
    return uuidv4();
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handleSelectChange1 = (e) => {
    const value = e.target.value; // For Select component
    setFormData({
      ...formData,
      senderdesig: value,
    });
  };
  const handleSelectChange2 = (e) => {
    const value = e.target.value; // For Select component
    setFormData({
      ...formData,
      receiverdesig: value,
    });
  };
  const handleSelectChange3 = (e) => {
    const value = e.target.value; // For Select component
    setFormData({
      ...formData,
      subject: value,
    });
  };

  const handleKeywordChange = (index, value) => {
    const updatedKeywords = [...formData.keywords];
    updatedKeywords[index] = value;
    setFormData({ ...formData, keywords: updatedKeywords });
  };

  const addKeywordField = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      keywords: [...prevFormData.keywords, ""],
    }));
  };

  const removeKeywordField = (index) => {
    const updatedKeywords = [...formData.keywords];
    updatedKeywords.splice(index, 1);
    setFormData({ ...formData, keywords: updatedKeywords });
  };

  const handleSubmit = () => {
    const requiredFields = [
      "senderName",
      "senderAddress",
      "sendercity",
      "senderstate",
      "sendercountry",
      "recipientName",
      "recipientAddress",
      "receivercity",
      "receiverstate",
      "receivercountry",
      "date",
      "subject",
      ...formData.keywords.map((_, index) => `keyword[${index}]`),
    ];

    // console.log("Required fields:", requiredFields);

    const missingFields = requiredFields.filter((field) => {
      if (field.startsWith("keyword")) {
        const keywordIndex = parseInt(field.match(/\d+/)[0]);
        return !formData.keywords[keywordIndex]?.trim(); // Check if keyword is null before accessing trim()
      }
      return !formData[field];
    });

    console.log("Missing fields:", missingFields);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
    } else {
      toast.success("Generating your Letter");
      const uuid = generateUUID();
      setUUID(uuid);

      setFormData((prevFormData) => {
        const updatedFormData = { ...prevFormData, uuid: uuid };
        // console.log("Form submitted successfully:", updatedFormData);
        console.log(JSON.stringify(updatedFormData));
        // Send form data to the server
        fetch("http://127.0.0.1:8000/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            // Handle success response here
            console.log("Data sent successfully");
          })
          .catch((error) => {
            // Handle error here
            console.error(
              "There was a problem with your fetch operation:",
              error
            );
          });

        return updatedFormData;
      });
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <img src={logo} alt="Logo" className={classes.logo} />
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <div className={classes.spaceY8}>
          <Typography variant="h3" className={classes.title}>
            Compose a letter
          </Typography>
          <Typography variant="body1" className={classes.subtitle}>
            Enter the details of your letter.
          </Typography>
        </div>
        <div className={classes.spaceY4}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <div className={classes.selectContainer}>
                <Select
                  id="senderdesig"
                  label="Designation"
                  style={{ width: "10rem" }}
                  className={classes.formControl}
                  value={formData.senderdesig}
                  onChange={handleSelectChange1}
                >
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Miss">Miss</MenuItem>
                  <MenuItem value="Dr">Dr</MenuItem>
                </Select>
                <TextField
                  id="senderName"
                  label="Sender's name"
                  placeholder="Enter your name"
                  fullWidth
                  required
                  value={formData.senderName}
                  onChange={handleChange}
                />
              </div>
              <TextField
                id="senderAddress"
                label="Sender's address"
                placeholder="Enter your address"
                fullWidth
                multiline
                rows={3}
                required
                value={formData.senderAddress}
                onChange={handleChange}
              />
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "flex-end",
                  gap: "2rem",
                  marginTop: "1.8rem",
                }}
              >
                <TextField
                  id="sendercity"
                  label="Sender's City"
                  placeholder="Enter City"
                  required
                  value={formData.sendercity}
                  onChange={handleChange}
                />
                <TextField
                  id="senderstate"
                  label="Sender's State"
                  placeholder="Enter State"
                  required
                  value={formData.senderstate}
                  onChange={handleChange}
                />
                <TextField
                  id="sendercountry"
                  label="Sender's Country"
                  placeholder="Enter Country"
                  required
                  value={formData.sendercountry}
                  onChange={handleChange}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={classes.selectContainer}>
                <Select
                  id="receiverdesig"
                  label="Designation"
                  style={{ width: "10rem" }}
                  className={classes.formControl}
                  value={formData.receiverdesig}
                  onChange={handleSelectChange2}
                >
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Miss">Miss</MenuItem>
                  <MenuItem value="Dr">Dr</MenuItem>
                </Select>
                <TextField
                  id="recipientName"
                  label="Recipient's name"
                  placeholder="Enter recipient's name"
                  fullWidth
                  required
                  value={formData.recipientName}
                  onChange={handleChange}
                />
              </div>
              <TextField
                id="recipientAddress"
                label="Recipient's address"
                placeholder="Enter recipient's address"
                fullWidth
                multiline
                rows={3}
                required
                value={formData.recipientAddress}
                onChange={handleChange}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "2rem",
                  marginTop: "1.8rem",
                }}
              >
                <TextField
                  id="receivercity"
                  label="Receiver's City"
                  placeholder="Enter City"
                  required
                  value={formData.receivercity}
                  onChange={handleChange}
                />
                <TextField
                  id="receiverstate"
                  label="Receiver's State"
                  placeholder="Enter State"
                  required
                  value={formData.receiverstate}
                  onChange={handleChange}
                />
                <TextField
                  id="receivercountry"
                  label="Receiver's Country"
                  placeholder="Enter Country"
                  required
                  value={formData.receivercountry}
                  onChange={handleChange}
                />
              </div>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              style={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}
            >
              <TextField
                id="date"
                placeholder="Date"
                type="date"
                fullWidth
                required
                value={formData.date}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Select
                id="subject"
                label="Purpose of letter"
                className={classes.formControl}
                fullWidth
                value={formData.subject}
                onChange={handleSelectChange3}
              >
                <MenuItem value="ApplicationForMedicalLeaveToHOD">
                  Application for medical leave to HOD
                </MenuItem>
                <MenuItem value="⁠ApplicationForATMCard">
                  ⁠Application for ATM card
                </MenuItem>
                <MenuItem value="ApplicationForReCAT-ReFAT">
                  Application for reCAT/reFAT
                </MenuItem>
                <MenuItem value="jobOffer">Job offer letter </MenuItem>
              </Select>
            </Grid>
            {/* <TextField
                id="subject"
                label="Purpose of Letter"
                placeholder="Enter the subject"
                fullWidth
                required
                value={formData.subject}
                onChange={handleChange}
              /> */}
          </Grid>

          <div className={classes.keywordContainer}>
            {formData.keywords.map((keyword, index) => (
              <TextField
                key={index}
                label={`Keyword ${index + 1}`}
                placeholder={`Enter keyword ${index + 1}`}
                value={keyword}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
              />
            ))}
            <Button
              onClick={addKeywordField}
              variant="contained"
              color="primary"
              className={classes.button}
            >
              +
            </Button>
            {formData.keywords.length > 1 && (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => removeKeywordField(formData.keywords.length - 1)}
              >
                -
              </Button>
            )}
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <ToastContainer />
      </div>

      <div>{uuid && <Letter uuid={uuid} />}</div>
    </div>
  );
}
