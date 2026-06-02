import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Button, { type ButtonProps } from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import { useState } from "react";
import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import { useQuery } from "@tanstack/react-query";
import { fetchRepo, fetchUser } from "../api/api";
import ImageList from "@mui/material/ImageList";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

type repo = {
  html_url: string;
  name: string;
  description: string;
};

const SearchField = () => {
  const [input, setInput] = useState("");
  const [debInput, setDebInput] = useState("");
  const [startSearch, setStartSearch] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartSearch(true);
      setDebInput(input.trim());
    }, 3000);
    return () => clearTimeout(timer);
  }, [input]);
  function handleSearch() {
    setDebInput(input.trim());
    setStartSearch(true);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", debInput],
    queryFn: ({ signal }) => {
      return fetchUser(debInput, signal);
    },
    retry: false,
    enabled: debInput.trim() !== "",
    refetchOnWindowFocus: false,
  });
  // console.log(data)
  // console.log(JSON.stringify(data))
  // const jsonData=JSON.stringify(data)

  const { data: repoData } = useQuery({
    queryKey: ["repos", debInput],
    queryFn: ({ signal }) => fetchRepo(debInput, signal),
    retry: false,
    enabled: debInput.trim() !== " ",
    refetchOnWindowFocus: false,
  });

  return (
    <Box sx={{ mt: 5 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: "90%", sm: "70%" },
          }}
        >
          <Search
            sx={{ border: 2, height: "55px", width: { xs: "100%", sm: "80%" } }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              sx={{ fontSize: 22 }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Search>
          <ColorButton sx={{ p: 2 }} variant="contained" onClick={handleSearch}>
            Search
          </ColorButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading && (
          <Box sx={{ display: "flex", mt: 4 }}>
            <CircularProgress aria-label="Loading…" />
          </Box>
        )}
        {isError && !data && <h2>{`Error occurred : ${error.message}`}</h2>}
        {startSearch && !data && !isError && !isLoading && (
          <h2>Search to find Data</h2>
        )}
        {!isError && data && (
          <Card
            sx={{
              height: "auto",
              mt: 5,
              maxWidth: "900px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ImageList sx={{ width: "300px", height: "300px" }}>
                <img
                  src={data?.avatar_url}
                  alt=""
                  style={{
                    width: "190%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "150px",
                    marginLeft: 6,
                  }}
                />
              </ImageList>
            </Box>
            <Box sx={{}}>
              <Box
                sx={{
                  flex: 1,
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  // gap: 2,
                }}
              >
                <h2>Name: {data?.name || data?.login}</h2>

                <p>
                  <strong>Username:</strong> {data?.login}
                </p>

                <p>
                  <strong>Bio:</strong> {data?.bio || "No bio available"}
                </p>

                <p>
                  <strong>Followers:</strong> {data?.followers}
                </p>

                <p>
                  <strong>Following:</strong> {data?.following}
                </p>

                <p>
                  <strong>Public Repositories:</strong> {data?.public_repos}
                </p>

                <p>
                  <strong>Location:</strong> {data?.location || "Not specified"}
                </p>

                <p>
                  <strong>Profile:</strong>
                  <a
                    href={data?.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: "8px" }}
                  >
                    Visit GitHub
                  </a>
                </p>
              </Box>
            </Box>
          </Card>
        )}
        {data && repoData && <h2>User Repositories</h2>}
        <Box
          sx={{
            display: "grid",
            m: 4,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
          }}
        >
          {data && repoData && repoData.length == 0 && (
            <h2>No Repositories available</h2>
          )}

          {repoData &&
            repoData.map((ele: repo) => (
              <Box
                sx={{
                  border: 1,
                  height: "150px",
                  margin: "8px",
                  borderRadius: "20px",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                key={ele.html_url}
              >
                <a href={ele.html_url} target="_blank">
                  <h3>{ele.name}</h3>
                </a>
                <p
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {ele.description || "No description available"}
                </p>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchField;
