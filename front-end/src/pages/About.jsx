import React from "react";
import '../Style.css';

function About() {
    return (
        <div className="about">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                        <h1 className="text-center mb-4">About Me</h1>
                        <p className="lead text-justify">
                            This is a simple React application that demonstrates routing between different pages using React Router. The application includes a Home page, an About page, and a Contact page. Each page has its own component and is styled using a common CSS file. Its design is clean and minimalistic, and easy to navigate.
                        </p>
                        <p className="text-justify">
                            It also includes a contact form on the Contact page where users can send messages. The form includes fields for the user's name, email, and message. The application is designed to be responsive and user-friendly. Feel free to explore the code.
                        </p>
                        <p className="text-justify">
                            You can find the source code on my GitHub repository.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
