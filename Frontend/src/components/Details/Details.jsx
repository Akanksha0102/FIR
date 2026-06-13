import './style.css';
import React, { useState } from 'react';
import Gallery from './Gallary';
import { motion } from "framer-motion";
import { staggerContainer } from "../Tracks/motion";
import styles from "../Tracks/style";
import Popup from './Firform';
import FormDetails from './FormDetails';

function Details() {

  const [activeTab, setActiveTab] = useState(0);
  const [buttonPopup, setButtonPopup] = useState(false);

  // ✅ ADD THIS (IMPORTANT)
  const [fileId, setFileId] = useState(null);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex flex-col`}
    >

      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>

        <div className='container flex justify-center'>

          {/* ✅ PASS setFileId TO FORM */}
          <FormDetails setFileId={setFileId} />

          <button
            className='btn btn-outline-success w-40 h-8 flex text-center justify-center my-5 mx-5'
            onClick={() => setButtonPopup(true)}
          >
            Print FIR
          </button>

        </div>
      </Popup>

      {/* ✅ PASS fileId TO GALLERY */}
      <Gallery activeTab={activeTab} fileId={fileId} />

    </motion.div>
  );
}

export default Details;