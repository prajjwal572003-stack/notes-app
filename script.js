let notes = JSON.parse(localStorage.getItem("notes")) || [];

displayNotes();

/* ADD NOTE */

function addNote(){

let title = document.getElementById("title").value;
let text = document.getElementById("text").value;
let category = document.getElementById("category").value;
let color = document.getElementById("color").value;
let reminder = document.getElementById("reminder").value;

if(title === "" && text === ""){
alert("Write something!");
return;
}

let note = {
title,
text,
category,
color,
reminder,
pinned:false
};

notes.push(note);

localStorage.setItem("notes",JSON.stringify(notes));

document.getElementById("title").value="";
document.getElementById("text").value="";

displayNotes();

}


/* DISPLAY NOTES */

function displayNotes(){

let notesDiv = document.getElementById("notes");
notesDiv.innerHTML="";

notes.sort((a,b)=>b.pinned-a.pinned);

notes.forEach((note,index)=>{

let div = document.createElement("div");

div.className="note";
div.style.background = note.color;

div.setAttribute("draggable","true");
div.dataset.index=index;

div.ondragstart = drag;
div.ondragover = allowDrop;
div.ondrop = drop;

div.innerHTML = `
<h3>${note.title}</h3>
<p>${note.text}</p>
<small>${note.category}</small>
<br>
<button onclick="pinNote(${index})">📌</button>
<button onclick="editNote(${index})">✏️</button>
<button onclick="deleteNote(${index})">🗑</button>
`;

notesDiv.appendChild(div);

});

document.getElementById("noteCount").innerText =
"Total Notes: " + notes.length;

checkReminders();

}


/* DELETE NOTE */

function deleteNote(index){

notes.splice(index,1);

localStorage.setItem("notes",JSON.stringify(notes));

displayNotes();

}


/* EDIT NOTE */

function editNote(index){

let newTitle = prompt("Edit title",notes[index].title);
let newText = prompt("Edit text",notes[index].text);

if(newTitle !== null && newText !== null){

notes[index].title = newTitle;
notes[index].text = newText;

localStorage.setItem("notes",JSON.stringify(notes));

displayNotes();

}

}


/* PIN NOTE */

function pinNote(index){

notes[index].pinned = !notes[index].pinned;

localStorage.setItem("notes",JSON.stringify(notes));

displayNotes();

}


/* SEARCH */

function searchNotes(){

let search = document.getElementById("search").value.toLowerCase();

let allNotes = document.getElementsByClassName("note");

for(let i=0;i<allNotes.length;i++){

let text = allNotes[i].innerText.toLowerCase();

if(text.includes(search)){
allNotes[i].style.display="block";
}else{
allNotes[i].style.display="none";
}

}

}


/* FILTER CATEGORY */

function filterNotes(){

let filter = document.getElementById("filter").value;

let notesDiv = document.getElementById("notes");

notesDiv.innerHTML="";

notes.forEach((note,index)=>{

if(filter === "All" || note.category === filter){

let div = document.createElement("div");

div.className="note";
div.style.background = note.color;

div.innerHTML = `
<h3>${note.title}</h3>
<p>${note.text}</p>
<small>${note.category}</small>
<br>
<button onclick="pinNote(${index})">📌</button>
<button onclick="editNote(${index})">✏️</button>
<button onclick="deleteNote(${index})">🗑</button>
`;

notesDiv.appendChild(div);

}

});

}


/* DARK MODE */

function toggleDark(){

document.body.classList.toggle("dark");

}


/* REMINDER */

function checkReminders(){

let now = new Date().toISOString().slice(0,16);

notes.forEach(note=>{

if(note.reminder && note.reminder === now){

alert("Reminder: " + note.title);

}

});

}


/* BACKUP */

function backupNotes(){

let data = JSON.stringify(notes);

let blob = new Blob([data],{type:"application/json"});

let url = URL.createObjectURL(blob);

let a = document.createElement("a");

a.href = url;
a.download = "notes-backup.json";

a.click();

}


/* RESTORE */

function restoreNotes(){

let file = document.getElementById("restoreFile").files[0];

let reader = new FileReader();

reader.onload = function(){

notes = JSON.parse(reader.result);

localStorage.setItem("notes",JSON.stringify(notes));

displayNotes();

};

reader.readAsText(file);

}


/* EXPORT PDF */

function exportPDF(){

const { jsPDF } = window.jspdf;

let doc = new jsPDF();

let y = 10;

notes.forEach(note=>{

doc.text(note.title + " : " + note.text,10,y);

y += 10;

});

doc.save("notes.pdf");

}


/* VOICE INPUT */

function startVoice(){

let recognition = new webkitSpeechRecognition();

recognition.lang="en-US";

recognition.onresult=function(event){

document.getElementById("text").value =
event.results[0][0].transcript;

};

recognition.start();

}


/* SCROLL TOP */

function scrollToTop(){

window.scrollTo({
top:0,
behavior:"smooth"
});

}


/* DRAG DROP */

let dragIndex;

function drag(event){

dragIndex = event.target.dataset.index;

}

function allowDrop(event){

event.preventDefault();

}

function drop(event){

event.preventDefault();

let dropIndex = event.target.dataset.index;

let temp = notes[dragIndex];

notes.splice(dragIndex,1);

notes.splice(dropIndex,0,temp);

localStorage.setItem("notes",JSON.stringify(notes));

displayNotes();

}