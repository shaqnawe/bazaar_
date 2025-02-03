'use client';

import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <span className={styles.cartContainer}>&#169; Shakti Shah</span>
        </footer>
    );
};

export default Footer;
