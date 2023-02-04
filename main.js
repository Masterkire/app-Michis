const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
});
api.defaults.headers.common['x-api-key'] = 'live_0Ps6E0eiia0G0Ntbfbz3Bsjj2EpUz5qJbzQR7cavkN5zvLLhmyTiAKi9AGD12N5t';
const btn = document.querySelector('#btn_gatos');
const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3&api_key=live_0Ps6E0eiia0G0Ntbfbz3Bsjj2EpUz5qJbzQR7cavkN5zvLLhmyTiAKi9AGD12N5t';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';


const spanError = document.querySelector('#error');

async function reloadRandomMichis(){
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();
    
    console.log('Random');
    console.log(data);

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
        const img1 = document.getElementById('img1')
        const img2 = document.getElementById('img2')
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        
        img1.src = data[0].url
        img2.src = data[1].url

        btn1.onclick = () => saveFavouriteMichis(data[0].id);
        btn2.onclick = () => saveFavouriteMichis(data[1].id);
    }
    
}

async function loadFavouriteMichis(){
    const res = await fetch(API_URL_FAVORITES,
        {
            method: 'GET',
            headers: {
                'x-api-key': 'live_0Ps6E0eiia0G0Ntbfbz3Bsjj2EpUz5qJbzQR7cavkN5zvLLhmyTiAKi9AGD12N5t'
            },
        });
    const data = await res.json();
    
    console.log('Favoritos');
    console.log(data);

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
        const section = document.getElementById('favoritesMichis');
        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Michis favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(michi => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Sacar al michi de favoritos');

            btn.id = 'btn_gatos_favorourites';
            img.src = michi.image.url;
            btn.appendChild(btnText);
            btn.onclick = () => deleteFavouriteMichi(michi.id);
            article.append(img, btn);
            section.appendChild(article);
            
        });
    }
    
}

async function saveFavouriteMichis(id){

    const {data, status} = await api.post('/favourites',{
        image_id: id,
    });

    /* const res = await fetch(API_URL_FAVORITES,{
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-api-key': 'live_0Ps6E0eiia0G0Ntbfbz3Bsjj2EpUz5qJbzQR7cavkN5zvLLhmyTiAKi9AGD12N5t'

        },
        body: JSON.stringify({
            image_id: id
        }),
    });
    
    const data = await res.json(); */

    console.log('Save');

    if (status !== 200) {
        spanError.innerHTML = "Hubo un error: " + status + data.message;
        console.error(error);
    } else {
        console.log('Michi guardado en favoritos');
        loadFavouriteMichis();
    }
}

async function deleteFavouriteMichi(id){
    const res = await fetch(API_URL_FAVORITES_DELETE(id),{
        method: 'DELETE',
        headers : {
            'x-api-key': 'live_0Ps6E0eiia0G0Ntbfbz3Bsjj2EpUz5qJbzQR7cavkN5zvLLhmyTiAKi9AGD12N5t'
        }
    });
    
    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log('Michi eliminado de favoritos');
        loadFavouriteMichis();
    }

}

async function uploadMichiPhoto() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            //'Content-Type': 'multipart/form-data',
            'x-api-key': 'live_0Ps6E0eiia0G0Ntbfbz3Bsjj2EpUz5qJbzQR7cavkN5zvLLhmyTiAKi9AGD12N5t'
        },
        body: formData,
    });

    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log('Foto de Michi subida');
        console.log({data});
        console.log(data.url);
        saveFavouriteMichis(data.id);
    }
}

const cargarImgPrev = () =>{
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    const reader = new FileReader();
    if (form.children.length === 3){
        const preview = document.getElementById('img');
        form.removeChild(preview);
    }

    reader.readAsDataURL(formData.get('file'))
    
    reader.onload = () => {
        const img = document.createElement('img');
        img.id = 'img';
        img.src = reader.result;
        form.appendChild(img);
    }
}

reloadRandomMichis();
loadFavouriteMichis();
btn.addEventListener("click", reloadRandomMichis);