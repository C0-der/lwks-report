import React from "react";

function Home() {
    return (
        <div className="home">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                        <h1 className="text-center mb-4">Home Page</h1>
                        <p className="lead text-justify">
                            Welcome to my React application! This is the home page where
                            you can find an overview of the app's features and functionalities.
                            The application is built using React, a popular JavaScript library
                            for building user interfaces. It includes multiple pages such as About,
                            Contact, Login, and Register, each with its own component and styling.
                            The app is designed to be user-friendly and responsive, ensuring a seamless
                            experience across different devices. Feel free to explore the various sections
                            of the app and learn more about its capabilities. Whether you're looking to
                            get in touch via the Contact page or learn more about the app on the About page,
                            everything is just a click away. Enjoy your visit!
                        </p>
                    </div>
                </div>
            </div>
            <div className="container mb-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 col-sm-12 text-center">
                        <img src="/images/img.jpg" alt="Limkokwing University Graduates" className="img-fluid rounded shadow mb-3" />
                        <p className="text-muted">
                            Limkokwing University of Creative Technology Lesotho, Maseru Campus Graduates for the class of 2022.
                        </p>
                    </div>
                </div>
            </div>
            <div className="container mb-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8 col-sm-12">
                        <h2 className="text-center mb-4">Technologies Used</h2>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">React.js (for frontend)</li>
                            <li className="list-group-item">JavaScript (the coding language)</li>
                            <li className="list-group-item">CSS (for styling)</li>
                            <li className="list-group-item">Bootstrap (for styling)</li>
                            <li className="list-group-item">React Router</li>
                            <li className="list-group-item">Node.js (for backend)</li>
                            <li className="list-group-item">Express (for backend)</li>
                            <li className="list-group-item">MySQL (for database)</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="container mb-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 col-sm-12 text-center">
                        <p className="text-muted">
                            Developer Contact Information is available in the Footer Section.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
