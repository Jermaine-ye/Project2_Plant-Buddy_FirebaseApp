import { useContext, useEffect, useState, forwardRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import {
  createStyles,
  Header,
  Group,
  ActionIcon,
  Container,
  Menu,
  Text,
  Button,
  Popover,
  MantineProvider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { buddyTheme } from "./Theme";
import { Home, User } from "tabler-icons-react";

import WeatherDisplay from "../components/WeatherDisplay";
import WeatherModal from "../components/WeatherModal";
import { PersonIcon } from "@radix-ui/react-icons";

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.fn.variant({
      variant: "filled",
      color: theme.colors.moss,
    }).background,
    borderBottom: 0,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,

    [theme.fn.smallerThan("sm")]: {
      justifyContent: "flex-start",
    },
  },

  links: {
    width: 260,

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  icons: {
    width: 260,

    [theme.fn.smallerThan("sm")]: {
      width: "auto",
      marginLeft: "auto",
    },
  },

  burger: {
    marginRight: theme.spacing.md,

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

// interface HeaderMiddleProps {
//   links: { link: string, label: string }[];
// }

export function HeaderMiddle(props) {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes, cx } = useStyles();

  return (
    <MantineProvider theme={buddyTheme}>
      {props.user && Object.keys(props.user).length > 0 ? (
        <Header height={56} mb={120} className={classes.header}>
          <Container className={classes.inner}>
            <Menu
              shadow="md"
              width={200}
              position="bottom-start"
              offset={2}
              withArrow
            >
              <Menu.Target>
                <ActionIcon variant="transparent" size="lg">
                  <Home strokeWidth={1} color={"#fff"} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>
                  <Text color="black" size="sm" align="left">
                    Logged in as: {props.user.displayName}
                  </Text>
                </Menu.Label>
                <Menu.Divider />
                <Menu.Item component={Link} to="/">
                  Plant Garden
                </Menu.Item>
                <Menu.Item component={Link} to="/community">
                  Community
                </Menu.Item>
                <Menu.Item component={Link} to="/forums">
                  Forum
                </Menu.Item>
                <Menu.Item component={Link} to="/recommendations">
                  Recommendations
                </Menu.Item>

                <div>
                  <Menu.Divider />
                  <Menu.Item color="red" onClick={props.handleLogout}>
                    <PersonIcon /> Log Out of {props.user.displayName}
                  </Menu.Item>
                </div>
              </Menu.Dropdown>
            </Menu>

            <Group
              spacing={0}
              className={classes.icons}
              position="right"
              noWrap
            >
              <Popover width={180} position="bottom" withArrow shadow="md">
                {/* <Popover.Target>
                <Button>Weather Now</Button>
              </Popover.Target> */}
                <Popover.Dropdown>
                  <Text size="sm">
                    <WeatherModal />
                  </Text>
                </Popover.Dropdown>

                <Popover.Target>
                  <Button className="weather-icon">
                    <WeatherDisplay />
                  </Button>
                </Popover.Target>
              </Popover>
            </Group>
          </Container>
        </Header>
      ) : null}
    </MantineProvider>
  );
}
