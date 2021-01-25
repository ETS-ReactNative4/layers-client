import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./Nav";
import SideDrawer from "./SideDrawer";
import Results from "./Results";
import SongPreview from "./SongPreview";
import { TextField, Grid, Container, Typography, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useDebounce from "../hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
  mainWindow: {
    width: "100%",
    margin: "auto"
  },
  mainHeader: {
    display: "flex",
    justifyContent: "space-between",
    // alignItems: "flex-end",
    width: "80%",
    // paddingLeft: 20,
    // paddingRight: 40,
    marginTop: 40,
    // marginRight: 40
  },
  cardHeader: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(5),
  },
  mainHeading: {
    marginRight: 40,
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  searchBox: {
    color: "white",
    backgroundColor: "var(--black)",
    border: "none",
    borderBottom: "var(--tertiary-color) 2px solid",
    width: "80%",
    position: 'relative',
    top: -12,
  },
  input: {
    color: "white"
  }
}));

export default function Search(props) {
  // const theme = useTheme();
  const matches = useMediaQuery('(min-width:960px)');

  const { isLoggedIn } = props;
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSongSelected, setIsSongSelected] = useState({});

  //SEARCH QUERY
  useEffect(() => {
    axios.get(`/api/content/`)
      .then( data => {
        const response = []
        if (data.data.songs.length > 0) {
          const dataFormatted = data.data.songs.map(entry => {
            return {
              trackId: entry.id,
              artistName: entry.artist,
              artworkUrl100: entry.url_album_artwork,
              trackName: entry.title,
              collectionName: entry.album,
              previewUrl: entry.url_full_song_preview
            }
          })
          response.push(...dataFormatted)
        }
        setResults(response);
      })
      .catch(err => console.log(err))
  }, [])

  const handleChange = (event) => {
    setTerm(event.target.value)
  }

  const filteredResults = results.filter(result => {
    return result.artistName.toLowerCase().includes(term.toLowerCase());
  })

  const classes = useStyles();
  return !isSongSelected.trackName ? (
    <div style={{ display: "flex" }}>
      {matches && <SideDrawer />}

      <div className={classes.mainWindow}>
        <Container className={classes.cardHeader} maxWidth="md" id="header">

          <header className={classes.mainHeader}>

            <Typography
              className={classes.mainHeading}
              component="h1"
              variant="h4"
              color="var(--white)">
              Search By Artist
               </Typography>
            {matches && <TextField
              autoFocus
              variant="filled"
              value={term}
              onChange={handleChange}
              className={classes.searchBox}
              InputProps={{
                className: classes.input
              }} />}
          </header>

        </Container>
        {!matches && <TextField
          variant="filled"
          value={term}
          onChange={handleChange}
          className={classes.searchBox}
          InputProps={{
            className: classes.input
          }} />}
        <Container className={classes.cardGrid} maxWidth="md" id="results">
          <Grid container spacing={4}>
            <Results results={filteredResults} setSong={setIsSongSelected}></Results>
          </Grid>
        </Container>
      </div>
      {!matches && <Nav />}
    </div >
  ) : (
      <div style={{ display: "flex" }}>
        {matches && <SideDrawer />}
        <div className={classes.mainWindow}>
          <SongPreview results={isSongSelected} setSong={setIsSongSelected} user={isLoggedIn} />
        </div>
        {!matches && <Nav />}
      </div>
    )
}