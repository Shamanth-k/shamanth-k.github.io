let navbarNavigation = false;

export const NAVBAR_NAVIGATION_START = "portfolio:navbar-navigation-start";
export const NAVBAR_NAVIGATION_END = "portfolio:navbar-navigation-end";

export function startNavbarNavigation() {
  navbarNavigation = true;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NAVBAR_NAVIGATION_START));
  }
}

export function isNavbarNavigating() {
  return navbarNavigation;
}

export function endNavbarNavigation() {
  navbarNavigation = false;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NAVBAR_NAVIGATION_END));
  }
}
