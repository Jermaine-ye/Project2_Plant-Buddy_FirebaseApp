import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Paper,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { UserContext } from "../App";
import { IconPlant, IconPlant2 } from "@tabler/icons";

import tipspic from "../images/TipsForum.png";
import tradingpic from "../images/TradingForum.png";

export default function Forums() {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const [currForum, setCurrForum] = useState("");

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    if (Object.keys(user) == 0) {
      navigate("/login");
    }
  });

  let forumTipsCard = (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      // sx={{ width: '85vw', color: '#1f3b2c' }}
    >
      <Card.Section>
        <Image src={tipspic} alt="forumtipsicon" className="forum-Drawkits" />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={600}>Plant Care Tips</Text>
      </Group>

      <Text size="sm" color="dimmed">
        This forum is for fellow Bud-dies to come together to share green tips
        and reach out when they need help!
      </Text>
      <Button
        leftIcon={<IconPlant />}
        variant="filled"
        color="seashell"
        size="md"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => {
          setCurrForum("/forumTips");
          navigate("/forums/forumTips");
          console.log(currForum);
        }}
      >
        Enter Plant Care
      </Button>
    </Card>
  );

  let forumTradingCard = (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      // sx={{ width: '85vw', color: '#1f3b2c' }}
    >
      <Card.Section>
        <Image
          src={tradingpic}
          alt="forumtradesicon"
          className="forum-Drawkits"
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={600}>Let's Trade Plants!</Text>
      </Group>

      <Text size="sm" color="dimmed">
        This forum is for people who are interested in sharing and swapping
        plants and seedlings, share the joy!!
      </Text>
      <Button
        leftIcon={<IconPlant2 />}
        variant="filled"
        color="seashell"
        size="md"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => {
          setCurrForum("/forumTrading");
          navigate("/forums/forumTrading");
          console.log(currForum);
        }}
      >
        Enter Trading Room
      </Button>
    </Card>
  );

  return (
    <div>
      <h1>Forums</h1>

      <Grid>
        <Grid.Col md={6} lg={6}>
          {forumTipsCard}
        </Grid.Col>
        <Grid.Col md={6} lg={6}>
          {forumTradingCard}
        </Grid.Col>
      </Grid>
    </div>
  );
}
