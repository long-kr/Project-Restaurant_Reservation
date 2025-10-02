import React from 'react';

export default function Header() {
  return (
    <div
      id="main-navbar"
      className="pt-2 d-flex justify-content-center
                navbar navbar-expand-lg navbar-light fixed-top"
    >
      <h1
        className="display-4"
        data-toggle="collapse"
        href="#sidebarMenu"
        role="button"
        aria-expanded="false"
        aria-controls="sidebarMenu"
      >
        Reservations
      </h1>
    </div>
  );
}
