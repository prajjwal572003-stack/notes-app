let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes(){
localStorage.setItem("notes", JSON.stringify(notes));
}

function displayNotes(list = notes){

let notesDiv = document.getElementById("notes");
notesDiv.innerHTML="";

list.forEach((note,index)=>{

let div = document.createElement("div");
div.className="note";

if(note.pinned){
div.classList.add("pinned");
}

div.style.background = note.color;

div.setAttribute("draggable","true");
div.setAttribute("data-index",index);

div.addEventListener("dragstart",dragStart);
div.addEventListener("dragover",dragOver);
div.addEventListener("drop",dropNote);

div.innerHTML = `
<h3>${note.title}</h3>
<p>${note.text}</p>

<button onclick="togglePin(${index})">📌</button>
<button onclick="editNote(${index})">Edit</button>
<button onclick="deleteNote(${index})">Delete</button>
`;

notesDiv.appendChild(div);

});
}

function addNote(){

let title = document.getElementById("title").value;
let text = document.getElementById("text").value;
let color = document.getElementById("color").value;

if(title === "" && text === "") return;

notes.push({
title:title,
text:text,
color:color,
pinned:false
});

saveNotes();
displayNotes();

document.getElementById("title").value="";
document.getElementById("text").value="";

}

function deleteNote(index){

notes.splice(index,1);

saveNotes();
displayNotes();

}

function editNote(index){

let newText = prompt("Edit note",notes[index].text);

if(newText !== null){

notes[index].text = newText;

saveNotes();
displayNotes();

}

}

function togglePin(index){

notes[index].pinned = !notes[index].pinned;

notes.sort((a,b)=>b.pinned - a.pinned);

saveNotes();
displayNotes();

}

function searchNotes(){

let search = document.getElementById("search").value.toLowerCase();

let filtered = notes.filter(note =>
note.title.toLowerCase().includes(search) ||
note.text.toLowerCase().includes(search)
);

displayNotes(filtered);

}

let draggedIndex = null;

function dragStart(e){
draggedIndex = e.target.dataset.index;
}

function dragOver(e){
e.preventDefault();
}

function dropNote(e){

let targetIndex = e.target.closest(".note").dataset.index;

let temp = notes[draggedIndex];
notes.splice(draggedIndex,1);
notes.splice(targetIndex,0,temp);

saveNotes();
displayNotes();

}

function toggleDark(){
document.body.classList.toggle("dark");
}

displayNotes();