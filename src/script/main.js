import '../style/style.scss'
import './custom.js'
import 'regenerator-runtime'



const inputBtn = document.querySelector('.input-btn');
const inputBar = document.querySelector('.input-bar');
inputBar.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        inputBtn.click();
    }
})


inputBtn.addEventListener('click', async function () {
    const inputBar = document.querySelector('.input-bar');
    if (inputBar.value == '') {
        alert('Please enter the song');
    } else {
        try {
            const options = {
                headers: {
                    "x-rapidapi-key": "cedfa25721msh8ff8e3bfb8c445ap19d34ejsn001eee3d4807",
                    "x-rapidapi-host": "shazam.p.rapidapi.com",
                }
            }

            const response = await fetch(`https://shazam.p.rapidapi.com/search?offset=0&term=${inputBar.value}`, options);
            const responseJson = await response.json();
            if (responseJson.tracks === undefined) {
                alert("Can't find the song");
            } else {
                renderSongs(responseJson.tracks.hits);
            }
            const modalBtn = document.querySelectorAll('.lyric-button');
            modalBtn.forEach(m => {
                m.addEventListener('click', async function () {
                    fetch(`https://shazam.p.rapidapi.com/songs/get-details?locale=en-US&key=/${this.dataset.songid}`, options)
                        .then(res => res.json())
                        .then(resJson => renderModal(resJson))
                        .catch(error => {
                            console.error('Error:', error);
                        })
                })

            })

        } catch (error) {
            console.log(error);
        }
    }
})

const change = str => {
    const firstChange = str.replace("https://youtu.be/", "https://youtube.com/embed/");
    const secondChange = firstChange.replace("autoplay=1", "autoplay=0");
    return secondChange
}

const renderSongs = res => {
    const songList = document.querySelector('.song-list');
    songList.innerHTML = '';
    res.forEach(s => {
        songList.innerHTML += `
        <div class="card">
                    <img src="${s.track.share.image}" alt="Thumbnail Image">
                    <div class="desc">
                        <h1>${s.track.title}</h1>
                        <h2>${s.track.subtitle}</h2>
                        <div class="lyric-button" data-songid =${s.track.key}>Lyric</div>
                    </div>
                </div>`;
    })
}


const renderModal = s => {
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = '';
    modalBody.innerHTML += `
                <div class="modal-bg">
                    <div class="modal">
                    <iframe width="560" height="315" src="${change(s.sections[2].youtubeurl.actions[0].uri)}" frameborder="0"></iframe>
                        <a href="${s.sections[2].youtubeurl.actions[0].uri}" class="yt-alt">*Click here to watch on YouTube</a>
                        <div class="lyric-container">
                        ${s.sections[1].text.map(e => e).join('<br>')}                        
                        </div>
                        <span class="close-btn">X</span>
                    </div>
                </div>
    `

    const modalBtn = document.querySelectorAll('.lyric-button');
    modalBtn.forEach(m => {
        m.addEventListener('click', function () {
            setTimeout(() => {
                const modalBg = document.querySelector('.modal-bg');
                modalBg.style.display = 'block';
            }, 3000);

        })

    })


    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', function () {
        const modalBg = document.querySelector('.modal-bg');
        const iframe = document.querySelector('iframe');
        modalBg.style.display = 'none';
        iframe.src = 'about:blank';
    })
}