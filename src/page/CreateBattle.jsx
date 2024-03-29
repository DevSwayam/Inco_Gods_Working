import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles";
import { useGlobalContext } from "../context";
import { CustomButton, CustomInput, GameLoad, PageHOC } from "../components";

const CreateBattle = () => {
  const { contract, gameData, battleName, setBattleName, setErrorMessage } =
    useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true);
    }
  }, [gameData]);

  const handleClickMultiplayer = async () => {
    if (battleName === "" || battleName.trim() === "") return null;

    try {
      await contract.createBattle(battleName, {
        gasLimit: 7920027,
      });

      setWaitBattle(true);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const handleClickSinglePlayer = async () => {
    if (battleName === "" || battleName.trim() === "") return null;

    try {
      await contract.createSinglePlayerBattle(battleName, {
        gasLimit: 7920027,
      });

      setWaitBattle(true);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <>
      {waitBattle && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle"
          placeHolder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />
        <div>
          <CustomButton
            title="Single Player Battle"
            handleClick={handleClickSinglePlayer}
            restStyles="mt-6"
          />
          <CustomButton
            title="Multiplayer Battle"
            handleClick={handleClickMultiplayer}
            restStyles="mt-6"
          />
        </div>
      </div>
      <p className={styles.infoText} onClick={() => navigate("/join-battle")}>
        Or join already existing battles
      </p>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a new Battle
  </>,
  <>Create your own battle and wait for other players to join you</>
);
