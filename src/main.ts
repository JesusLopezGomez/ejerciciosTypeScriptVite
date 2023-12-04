import { User } from "./interfaces/user";
import { Post } from "./interfaces/post";
import axios,{ AxiosResponse } from "axios";

const urlParams = new URLSearchParams(window.location.search);

const urlApiUser:string = "http://localhost:3000/users";
const urlApiPost:string = "http://localhost:3000/posts";

const form = document.querySelector("form");
const lista = document.getElementById("listUser");

let name = document.getElementById("name") as HTMLInputElement;
let email = document.getElementById("email") as HTMLInputElement;
let age = document.getElementById("age") as HTMLInputElement;

if(urlParams.size > 0){
  console.log(urlParams.toString());
  console.log(urlParams.get("id"));
}else{
  axios.get<User[]>(urlApiUser)
      .then( (response: AxiosResponse<User[]>) => {
          const users = response.data;
          users.forEach(async user => {
            
            let liU = addUser(user);
            let listPost = document.createElement("ul");
            axios.get<Post[]>(urlApiPost, {
              params: {
                authorId: user.id
              }
            })
  
            .then((response: AxiosResponse<Post[]>) => {
              let posts = response.data;
              posts.forEach(post => {
                let li = document.createElement("li");
                li.appendChild(document.createTextNode(`${post.authorId}:${post.content}:${post.id}:${post.title}`)); 
                listPost.appendChild(li);         
                liU.appendChild(listPost);            
              })    
            })
            
            lista?.appendChild(liU);
          })
      })
      .catch((error) => {
          console.error('Error al obtener datos:', error);
      });
}

form?.addEventListener("submit",(e) => {
  e.preventDefault();

  if(name.value && email.value && age.value){
    const newUser :Omit<User,"id"> = {
      name:name.value,
      email:email.value,
      age:parseInt(age.value),
      isAdmin:false,
    }

    addUserApi(newUser);
  }

})

function addUserApi(newUser: Omit<User,"id">) {
  axios.post<User>(urlApiUser, newUser)
    .then((response: AxiosResponse<User>) => {
      let user: User = response.data;
      let liU = addUser(user);
      lista?.appendChild(liU);
    })
    .catch((error) => {
      console.error('Error al crear usuario:', error);
    });
}



function addUser(user: User) {
  let liU = document.createElement("li");
  liU.appendChild(document.createTextNode(`${user.name}:${user.isAdmin}:${user.id}:${user.email}:${user.age}`));
  return liU;
}
