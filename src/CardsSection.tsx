import React from 'react';
import { Card, CardContent, Typography, Grid, CardActions, Button, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CardsSection = () => {
  const navigate = useNavigate();

  const cards = [
    { 
      id: 1, // Add unique ID for each card
      title: 'Eesti heategevusfond', 
      description: 'Fond palub annetusi arve tasumiseks, mis katab toimetulekuraskustes peredele toidu ja eluasemetoetusi kogusummas 5000 eurot.', 
      image: '/vravi.png' 
    },
    { 
      id: 2,
      title: 'Loomakaitse fond', 
      description: 'Fond palub annetusi, et katta veterinaarteenuste ja ravimite arve, mille kogusumma on 2500 eurot, et päästa ja ravida loomad, kes on kannatanud väärkohtlemise tõttu.', 
      image: '/vloom.png' 
    },
    { 
      id: 3,
      title: 'Punane rist', 
      description: 'Fond küsib annetusi meditsiiniliste vahendite hankimiseks kogusummas 10 000 eurot, et aidata kriisiolukordades, nagu sõjad ja looduskatastroofid, vajaliku arstiabi ja ravimitootega inimesi.', 
      image: '/prist.png' 
    },
  ];

  return (
    <Grid container spacing={2} sx={{ marginTop: 4, padding: 2 }}> {/* Added padding to Grid container */}
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={4} key={card.id}>
          <Card elevation={3} sx={{ padding: 2 }}> {/* Added padding to each Card */}
            <CardMedia
              component="img"
              height="500"
              image={card.image}
              alt={card.title}
              sx={{
                objectFit: 'cover',
              }}
            />
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {card.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  WebkitLineClamp: 3,
                }}
              >
                {card.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                color="primary" 
                onClick={() => navigate(`/card/${card.id}`)} // Navigate to detail page
              >
                Soovin annetada
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardsSection;
