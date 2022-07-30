import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react'
import { NotificationsProvider, showNotification } from '@mantine/notifications';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { HomePage, Auth, Page404, RoomPage, PostPage, MyRoomPage, AboutPage, MyReservationsPage, SingleRoomPage, SingleMyRoomPage, SingleReservationsPage, DashboardPage, UserProfilePage, PageLoader } from "./pages"
import { Navbar, Footer } from "./components"
import { getUserGoogle, hasTokenExpired } from "./utilities"
import { logout, authReset } from './features/auth/authSlice';
import { Helmet } from "react-helmet";

function App() {
  const [colorScheme, setColorScheme] = useState(JSON.parse(localStorage.getItem('mantine-color-scheme')) || 'light');
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [successOAuth, setSuccessOAuth] = useState(false);

  useEffect(() => {
    localStorage.setItem("mantine-color-scheme", JSON.stringify(colorScheme));
    if (user !== null || user !== undefined) {
      if (hasTokenExpired(user)) {
        dispatch(logout())
        dispatch(authReset())
        navigate('/')
        console.log(
          "%cExpired token. Please login again.",
          "color: yellow; font-size: 35px; background-color: red;"
        );
        return showNotification({
          title: 'Expired Token! Please login again.',
          autoClose: 2000,
          color: 'red',
        })
      }
    }
  }, [colorScheme, user, dispatch, navigate]);

  useEffect(() => {
    const queryString = window.location.search; // returns the url after "?"
    const urlParams = new URLSearchParams(queryString); // converts the url to an object
    let id = urlParams.get('id');

    if (id) {
      getUserGoogle();
      setSuccessOAuth(true);
    }
    return () => { };
  }, []);

  useEffect(() => {
    if (successOAuth) {
      window.location.href = "/"
    }
    return () => { };
  }, [successOAuth]);

  const toggleColorScheme = () => {
    colorScheme === "light" ? setColorScheme("dark") : setColorScheme("light")
  }

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  const theme = {
    colorScheme,
    loader: 'oval',
    fontSizes: { xxs: 12, xs: 13, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 },
    spacing: { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 64 },
    Container: {
      sizes: {
        xs: 540,
        sm: 720,
        md: 960,
        lg: 1140,
        xl: 1500,
      },
    },
    colors: {
      darkBlue: ['#0066cc', '#005cb8', '#0052a3', '#00478f', '#003d7a', '#003366', '#002952', '#001f3d', '#001429', '#000a14']
    }
  }

  /**
 * Ensures that everytime we switch to another route, we will always be on the top page
 * https://v5.reactrouter.com/web/guides/scroll-restoration
 * https://stackoverflow.com/questions/70193712/how-to-scroll-to-top-on-route-change-with-react-router-dom-v6
 * @returns {void}
 */
  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  }

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider position='top-right'>
          <>
            <Helmet>
              <title>Vacay - Houses, Apartment, Room For Rent</title>
            </Helmet>
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} /> {/* Home */}
              <Route path="/profile/:id" element={<UserProfilePage />} />
              <Route path="/auth" element={<Auth />} /> {/* Login/ Register */}
              <Route path="/post-room" element={<PostPage />} /> {/* Create listing */}
              <Route path="/listings/:id" element={<SingleRoomPage />} /> {/* Single listing page */}
              <Route path="/listings" element={<RoomPage />} /> {/* All listings */}
              <Route path="/my-listings/:id" element={<SingleMyRoomPage colorScheme={colorScheme} />} /> {/* Your listing/ configure them */}
              <Route path="/my-listings" element={<MyRoomPage />} /> {/* All YOUR listings */}
              <Route path="/my-reservations/:id" element={<SingleReservationsPage />} />
              <Route path="/my-reservations" element={<MyReservationsPage />} /> {/* All your reservations */}
              <Route path="/about" element={<AboutPage />} /> {/* About/ Faq Page */}
              <Route path="/load" element={<PageLoader />} /> {/* About/ Faq Page */}
              {/* Admin only routes */}
              {user?.is_admin &&
                <Route path="/dashboard" element={<DashboardPage colorScheme={colorScheme} />} />
              }
              <Route path="*" element={<Page404 />} />
            </Routes>
            <Footer />
          </>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
