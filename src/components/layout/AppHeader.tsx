import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const AppHeader = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <AppBar position="static" elevation={0} sx={{ background: "hsl(var(--background))", color: "hsl(var(--foreground))", borderBottom: "1px solid hsl(var(--border))" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, py: 1.5 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Form Builder
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button component={Link} to="/create" variant={isActive("/create") ? "contained" : "text"} color="primary">Create</Button>
            <Button component={Link} to="/preview" variant={isActive("/preview") ? "contained" : "text"} color="primary">Preview</Button>
            <Button component={Link} to="/myforms" variant={isActive("/myforms") ? "contained" : "text"} color="primary">My Forms</Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeader;
