import Box from "@mui/material/Box";
const Navbar = () => {
  return (
    <Box
      sx={{
        height: "80px",
        backgroundColor: "cyan",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2 style={{ textAlign: "center", margin: "" }}>GitHub User Details</h2>
    </Box>
  );
};

export default Navbar;
