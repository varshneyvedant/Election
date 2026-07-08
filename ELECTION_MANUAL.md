# 🏫 School Polling Booth - Official Master Manual

Welcome to the **School Polling Booth (Premium Edition)**. This document contains EVERYTHING you need to know to move this software to a school computer, set it up, run the election, and securely extract the results.

---

## 💾 PART 1: HOW TO TRANSFER TO THE SCHOOL COMPUTER

Right now, this software is on your personal laptop. To move it to the school computer via a Pen Drive:

1. **Copy the Folder**: Copy the entire project folder (the one containing this manual) onto your Pen Drive.
   > *Note: It might take a few minutes because the `node_modules` folder has many tiny files.*
2. **Paste it at School**: Plug the Pen Drive into the school computer and copy the folder onto the school computer's Desktop. Do NOT run it directly from the Pen Drive, as it will be very slow.
3. **Install Node.js (Crucial Step)**:
   The school computer MUST have **Node.js** installed to run this app. 
   - Go to [https://nodejs.org](https://nodejs.org) on the school computer.
   - Download the **"LTS" (Long Term Support)** version.
   - Install it (just keep clicking Next until it finishes).

---

## 🚀 PART 2: HOW TO START THE ELECTION SERVER

Once the folder is on the school computer's Desktop, follow these exact steps:

1. Open the project folder on the school computer's Desktop.
2. In the folder window, click on the **Address Bar** at the top.
3. Delete whatever text is there, type `cmd`, and press **Enter**. (This will open a black terminal window).
4. In the black terminal window, we first need to compile the optimized production version. Type this and press **Enter**:
   ```
   npm run build
   ```
5. Wait for the compilation to finish (it might take 1-2 minutes). 
6. Once it says it has successfully built, type this command to start the highly efficient production server and press **Enter**:
   ```
   npm start
   ```
7. Wait for a few seconds until you see text saying `Ready in ...ms`. 
8. Do **NOT** close this black window. If you close it, the election system turns off. Just minimize it.

---

## 🗳️ PART 3: HOW TO RUN THE ELECTION

Now that the server is running, the computer is officially an Electronic Voting Machine (EVM).

1. Open **Google Chrome** (or Edge) on the school computer.
2. In the URL bar at the top, type:
   ```
   localhost:3000
   ```
3. This is the **Public Voting Kiosk**. 
4. Call the students one by one. They will enter their Voter ID/Roll Number on this screen.
5. The screen will welcome them, they will cast their vote, see their Digital Receipt Code, and the screen will automatically reset for the next person!

---

## 🔐 PART 4: HOW THE ADMIN LOGS IN

To add candidates, register voters, or see the final results, you need to access the Admin Dashboard.

1. Open a new tab in Google Chrome.
2. Type this secret link in the URL bar:
   ```
   localhost:3000/login
   ```
3. Use the Master Credentials to log in:
   - **Username**: `admin`
   - **Password**: `password123`

---

## 📊 PART 5: USING THE ADMIN DASHBOARD

Once inside the Admin Dashboard, you have 5 main tabs:

### 1. Election Controls
Here you can click **"Initialize Election"** to allow students to start voting, or **"Halt Election"** to lock the system so nobody can vote. 
*Warning: Do NOT click "Purge Database" unless you want to permanently delete all votes and start over!*

### 2. Identity Register
Here you add the students who are allowed to vote. 
- Click **"Add Manual Record"**.
- Set the Clearance to **Student**.
- Their **ID / Username** is what they will type into the voting machine to vote (e.g. Roll Number `101`).
- You can also see if a student has already voted (it will say YES in green).

### 3. Ballot Configuration
Here you add the Candidates who are running in the election. Add them before the election starts!

### 4. Results (Highly Confidential)
This tab shows the final vote counts. 
- When you click it, the numbers are locked. 
- Type the master password: **`classeightelections`** to reveal the final tallies and the total voter turnout.

### 5. Election Audit Log
This tab tracks exactly who voted for who. 
- You must type **`classeightelections`** to unlock it.
- It will show a list of every single vote cast: `Student Name -> Candidate Name -> Exact Time`. 

---

## 🛑 PART 6: HOW TO SHUT DOWN

When the election is completely finished and you have written down the final results:
1. Open the black terminal window that you minimized earlier.
2. Press `Ctrl + C` on your keyboard.
3. It might ask "Terminate batch job (Y/N)?". Type `Y` and press Enter.
4. You can now close the black window. The system is securely shut down.

---
*Developed securely for your School Election.*
