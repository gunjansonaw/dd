import { Helmet } from "react-helmet-async";
import { Box, Container, List, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/store";
import { setSchema } from "@/store/builderSlice";
import { useNavigate } from "react-router-dom";

export default function MyForms() {
  const forms = useAppSelector((s) => s.forms.forms);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const openForm = (idx: number) => {
    dispatch(setSchema(forms[idx]));
    navigate("/preview");
  };

  return (
    <>
      <Helmet>
        <title>My Forms | Dynamic Form Builder</title>
        <meta name="description" content="Browse your saved forms and open them for preview." />
        <link rel="canonical" href="/myforms" />
      </Helmet>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5">My Forms</Typography>
          {forms.length === 0 ? (
            <Typography color="text.secondary">No saved forms yet.</Typography>
          ) : (
            <Box sx={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}>
              <List>
                {forms.map((f, idx) => (
                  <ListItemButton key={f.id} onClick={() => openForm(idx)}>
                    <ListItemText primary={f.name || "Untitled Form"} secondary={`Created ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(f.createdAt))}`} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          )}
        </Stack>
      </Container>
    </>
  );
}
