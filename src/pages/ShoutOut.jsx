import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button
} from "@mui/material";
import axios from "axios";

const CONSTANT = {
  API_BASE: "https://postgre-backendbpq.onrender.com/",
  SOCKET_URL: "wss://postgre-backendbpq.onrender.com/ws"
};

const ShoutOut = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const res = await axios.get(CONSTANT.API_BASE + "getAllShoutOut");
      let parsed = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      if (parsed?.data) setData(parsed.data);
    } catch (err) {
      console.error("Error fetching shoutouts:", err);
    }
  };

  const deleteShoutOutComment = async (id) => {
    try {
      const res = await axios.post(CONSTANT.API_BASE + "deleteshoutrecord", { id });
      const result = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      if (result?.data?.status === "success") {
        getData();
      }
    } catch (err) {
      console.error("Error deleting shoutout:", err);
    }
  };

  const ws = useMemo(() => new WebSocket(CONSTANT.SOCKET_URL), []);
  useEffect(() => {
    ws.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (["RESULT", "NEW_SHOUTOUT", "STATUS"].includes(data?.type)) {
        getData();
      }
    };
    return () => ws.close();
  }, [ws]);

  useEffect(() => {
    getData();
    const intervalId = setInterval(() => getData(), 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2, mb: 6 }}>
      {data.map((item) => {
        const comments = item[8]?.split("|") || [];
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item[0]}>
            <Card sx={{ height: "100%" }}>
              <CardHeader
                avatar={<Avatar alt={item[2]} src={item[5]} />}
                title={<Typography fontWeight={700}> {item[2]} </Typography>}
                subheader={<Typography color='blue' fontWeight={500}> {item[1]} </Typography>}
              />
              <CardContent>
                {comments.map((comment, i) => (
                  <Typography key={i} variant="body1" gutterBottom>
                    {comment.trim()}
                  </Typography>
                ))}
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Quiz: {item[7]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(item[6]).toLocaleString()}
                </Typography>
                <Button onClick={() => deleteShoutOutComment(item[1])} variant='contained' color='error'>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ShoutOut;