let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes(){
localStorage.setItem("notes",JSON.stringify(notes));
}

function displayNotes(){

let notesDiv=document.getElementById("notes");
notesDiv.innerHTML="";

notes.forEach((note,index)=>{

let div=document.createElement("div");
div.className="note";

div.innerHTML=`
<h3>${note.title}</h3>
<p>${note.text}</p>
<button onclick="deleteNote(${index})">Delete</button>
`;

notesDiv.appendChild(div);

});

}

function addNote(){

let title=document.getElementById("title").value;
let text=document.getElementById("text").value;

if(title==="" && text==="") return;

notes.push({title,text});

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

function searchNotes(){

let search=document.getElementById("search").value.toLowerCase();

let filtered=notes.filter(note =>
note.title.toLowerCase().includes(search) ||
note.text.toLowerCase().includes(search)
);

let notesDiv=document.getElementById("notes");
notesDiv.innerHTML="";

filtered.forEach(note=>{

let div=document.createElement("div");
div.className="note";

div.innerHTML=`
<h3>${note.title}</h3>
<p>${note.text}</p>
`;

notesDiv.appendChild(div);

});

}

displayNotes();