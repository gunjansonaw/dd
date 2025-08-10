import { Container, Stack, Typography, Button, Box } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AI Form Builder | Create, Preview, Save</title>
        <meta name="description" content="Build dynamic forms with validations and derived fields. Preview instantly and save to localStorage." />
        <link rel="canonical" href="/" />
      </Helmet>
      <Box sx={{ minHeight: '80vh', display: 'grid', placeItems: 'center', background: 'radial-gradient(1200px 400px at 50% -10%, hsl(var(--accent)/0.6), transparent), linear-gradient(180deg, hsl(var(--background)), hsl(var(--background)))' }}>
        <Container maxWidth="md">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h3" fontWeight={700}>India’s First AI Form Builder Experience</Typography>
            <Typography color="text.secondary" fontSize={18}>
              Add fields, validations, and even derived logic. Preview in real-time and save forms locally — no backend required.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={RouterLink} to="/create" variant="contained" size="large">Start Building</Button>
              <Button component={RouterLink} to="/preview" variant="outlined" size="large">Preview</Button>
              <Button component={RouterLink} to="/myforms" variant="text" size="large">My Forms</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Index;
