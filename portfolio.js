//Welcome text animation
const welcomeText = document.getElementById('welcomeText');
const skillsText = document.getElementById('skillsText');

let welcomeMessage = "Hi, my name is Sheku A. Kamara, I am a Front-End Developer.";
let skillsMessage = "I build interactive and responsive websites using HTML, CSS, JavaScript, Bootstrap, SCSS, React.";
let index = 0;
let skillsIndex = 0;

function typeWriter(element, text, speed, reset = false) {
    if (reset) {
        element.innerHTML = "";
        index = 0;
    }

    if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
        setTimeout(() => typeWriter(element, text, speed, false), speed);
    };
};

function loopText() {
    typeWriter(welcomeText, welcomeMessage, 100, true);
    setTimeout(() => {
        typeWriter(skillsText, skillsMessage, 80, true);
    }, welcomeMessage.length * 100 + 2000);

    setTimeout(loopText, welcomeMessage.length * 100 + skillsMessage.length * 80 + 4000); 
};

loopText(); 