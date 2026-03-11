let notes = [];

if(localStorage.getItem("notes")){
notes = JSON.parse(localStorage.getItem("notes"));
}

displayNotes();

function saveNotes(){
localStorage.setItem("notes", JSON.stringify(notes));
}

function addNote(){

let title=document.getElementById("title").value;
let text=document.getElementById("text").value;
let color=document.getElementById("color").value;
let category=document.getElementById("category").value;
let reminder=document.getElementById("reminder").value;

notes.push({
title:title,
text:text,
color:color,
category:category,
reminder:reminder,
pinned:false
});

saveNotes();
displayNotes();

document.getElementById("title").value="";
document.getElementById("text").value="";
}

function displayNotes(){

let container=document.getElementById("notes");

container.innerHTML="";

notes.forEach((note,index)=>{

let div=document.createElement("div");

div.className="note";

div.style.background=note.color || "#fff";

div.setAttribute("draggable","true");

div.dataset.index=index;

div.addEventListener("dragstart",dragStart);
div.addEventListener("dragover",dragOver);
div.addEventListener("drop",dropNote);

div.innerHTML=`

<h3>${note.title}</h3>
<small>${note.category || "General"}</small>
<p>${note.text}</p>

<button onclick="togglePin(${index})">📌</button>
<button onclick="editNote(${index})">Edit</button>
<button onclick="deleteNote(${index})">Delete</button>

`;

container.appendChild(div);

});

}

function deleteNote(index){

notes.splice(index,1);

saveNotes();
displayNotes();

}

function editNote(index){

let newText=prompt("Edit note:",notes[index].text);

if(newText!==null){

notes[index].text=newText;

saveNotes();
displayNotes();

}

}

function togglePin(index){

notes[index].pinned=!notes[index].pinned;

saveNotes();
displayNotes();

}

let draggedIndex=null;

function dragStart(e){

draggedIndex=e.target.closest(".note").dataset.index;

}

function dragOver(e){

e.preventDefault();

}

function dropNote(e){

e.preventDefault();

let target=e.target.closest(".note");

if(!target) return;

let targetIndex=target.dataset.index;

let temp=notes[draggedIndex];

notes.splice(draggedIndex,1);

notes.splice(targetIndex,0,temp);

saveNotes();
displayNotes();

}

if(Notification.permission!=="granted"){
Notification.requestPermission();
}

function checkReminders(){

let now=new Date().getTime();

notes.forEach(note=>{

if(note.reminder){

let reminderTime=new Date(note.reminder).getTime();

if(reminderTime<=now){

new Notification("Reminder: "+note.title);

note.reminder="";

saveNotes();

}

}

});

}

setInterval(checkReminders,10000);