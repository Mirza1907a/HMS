const Task = require("../models/taskModel");

const generateTaskId = async () => {
  const prefix = "TASK-";
  const lettersLength = 2;
  const numbersLength = 2;
  let taskId;
  let isUnique = false;

  const generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  };

  while (!isUnique) {
    const randomLetters = generateRandomString(lettersLength);
    const randomDigits = Math.floor(Math.random() * 10 ** numbersLength)
      .toString()
      .padStart(numbersLength, "0");
    taskId = `${prefix}${randomLetters}${randomDigits}`;

    const existingBooking = await Task.findOne({ taskId });
    if (!existingBooking) {
      isUnique = true;
    }
  }

  return taskId;
};

module.exports = generateTaskId;
