import React, {useState, useEffect} from "react"
import logo from '../../assets/images/bitcoin-cash-logo-white-small.png';
import { useStaticQuery, graphql } from "gatsby"
import headerStyles from "./header.module.css"
import navBarItems from './navBarItems';
import hamburger from '../../assets/lib/hamburgers.min.css';
import axios from 'axios';
import LivePriceWidget from "../liveprice/live-price-widget";
import Link from '../../global/link';

/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
if (typeof window !== 'undefined') {
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (currentScrollPos <= 1000) return;
  if (prevScrollpos > currentScrollPos) {
    var navBar = document.getElementById("navbar")
    if (navBar) navBar.style.top = "0";
  } else {
    var navBar = document.getElementById("navbar")
    if (navBar) navBar.style.top = "-100px";
  }
  prevScrollpos = currentScrollPos;
}
}

const externalLink = (i, linkText, href) => {
  return <Link data-sal="slide-down"
            data-sal-delay={100 + (i * 100)}
            data-sal-duration="1000"
            data-sal-easing="ease"
            className={headerStyles.link}
            to={href}>{linkText}</Link>
}


const MobileHeaderLink = ({text, href}) => {
  return <Link className={headerStyles.mobileNavLink} to={href}>{text}</Link>
}

const Header = () => {
  const bchPriceApi = "https://min-api.cryptocompare.com/data/price?fsym=BCH&tsyms=USD";
  const [isActive, setIsActive] = useState(false);
  const [currentUSDPrice, setCurrentUSDPrice] = useState("-")
  const updateBchPrice = () => {
    axios.get(bchPriceApi).then((response) =>
    {
      if (response.data) {
        setCurrentUSDPrice(response.data.USD);
      }
    });
  }

  useEffect(() => {
    updateBchPrice();
    const interval = setInterval(() => {
      updateBchPrice();
    }, 10000);
    return () => clearInterval(interval);
  }, [])

  const data = useStaticQuery(graphql`
  query SiteThemeQuery {
    site {
      siteMetadata {
        themeColours {
          primary_dark,
          primary_light
        }
      }
    }
  }
`)

const theme = data.site.siteMetadata.themeColours;

return (
  <>
  <header
    id={isActive ? "navbar-mobile" : "navbar"}
    style={{
      background: `linear-gradient(270deg, ${theme.primary_dark} 0%, ${theme.primary_light} 100%)`
    }}
  >
    <div className={headerStyles.headerBar}>
      <div className={headerStyles.headerStart}>
        <img src={logo} className={headerStyles.logo} alt="bitcoincashlogo"></img>
        <LivePriceWidget currentPrice={"$" + currentUSDPrice} ticker={"USD"} url={"https://www.bitcoincash.org/buy-bitcoin-cash.html"}></LivePriceWidget>
      </div>

      <div className={`${headerStyles.headerLinks} topBotomBordersOut`}>
        {navBarItems.map(headerLink => {
          return headerLink.href ? 
            externalLink(headerLink.index, headerLink.text, headerLink.href) : headerLink.dropdown
        })}
      </div>


      <div className={headerStyles.mobileHeaderLinks}>
      <div className={`hamburger hamburger--squeeze ${isActive ? 'is-active' : ''}`} onClick={() => setIsActive(!isActive)}>
        <div className="hamburger-box">
        <div className="hamburger-inner"></div>
      </div>
    </div>
    </div>
    <div className={headerStyles.mobileMenu} style={isActive ? {height:'auto', backgroundColor: theme.primary_dark} : null}>
    {isActive &&
      <div className={headerStyles.mobileNavLinks}>
        {navBarItems.map(headerLink => {
          return headerLink.href ? 
            <MobileHeaderLink text={headerLink.text} href={headerLink.href}></MobileHeaderLink> : headerLink.mobileDropdown
        })}
      </div>}
    </div>
   
    </div>
  </header>
  </>)
}

export default Header
