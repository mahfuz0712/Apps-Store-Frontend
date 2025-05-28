import { useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const Settings = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const OpenModal1 = () => setOpen1(true);
  const OpenModal2 = () => setOpen2(true);
  const CloseModal1 = () => setOpen1(false);
  const CloseModal2 = () => setOpen2(false);
  return (
    <div>
      <button
        className="bg-green-500 text-white rounded-md px-2 py-1 text-sm hover:bg-green-700 mt-2"
        onClick={OpenModal1}
      >
        Open modal1
      </button>
      <button
        className="bg-green-500 text-white rounded-md px-2 py-1 text-sm hover:bg-green-700 mt-2"
        onClick={OpenModal2}
      >
        Open modal2
      </button>
      <Modal open={open1} onClose={CloseModal1} center>
        <h2>Simple centered modal 1</h2>
        <code>
          print(`Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Laborum assumenda doloremque, magni quasi temporibus neque id dolores
          mollitia culpa quaerat porro eius, odit perferendis voluptate tempora
          officiis modi, quidem atque!`)
        </code>
      </Modal>
      <Modal open={open2} onClose={CloseModal2} center>
        <h2>Simple centered modal 2</h2>
        <code>
          print(`Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Laborum assumenda doloremque, magni quasi temporibus neque id dolores
          mollitia culpa quaerat porro eius, odit perferendis voluptate tempora
          officiis modi, quidem atque!`)
        </code>
      </Modal>
    </div>
  );
};

export default Settings;
