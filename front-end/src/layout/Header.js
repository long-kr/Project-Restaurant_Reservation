import React from "react";

export default function Header() {

    return (
        <div id="main-navbar"
            className="d-flex flex-row flex-nowrap 
                navbar navbar-expand-lg navbar-light fixed-top "
        >
            <a
                className="navbar-toggler"
                data-toggle="collapse" 
                href="#sidebarMenu"
                role="button" 
                aria-expanded="false" 
                aria-controls="sidebarMenu"
            >
                <span className="oi oi-menu h3 "/>
            </a>
            <h1 className="display-3 flex-fill">Reservations</h1>
        </div>
    )
}