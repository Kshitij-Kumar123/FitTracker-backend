# FitTracker

## Check out the [app here](https://eappui.myprojectsdomain.net/)

## Introduction

FitTracker is a fitness tracking application developed to simplify the process of monitoring workout progress. Designed with user convenience in mind, it aims to address common frustrations encountered with existing fitness apps.

## Inspiration

Inspired by personal fitness goals and a desire to enhance DevOps skills, FitTracker seeks to provide a straightforward solution for workouts. It aims to offer an intuitive platform without the clutter and complexities often found in similar applications.


## Notable Achievements
FitTracker leverages modern DevOps tools and practices for safe and seamless deployment.


### Technologies Used
- ![Azure Kubernetes Service](https://img.shields.io/badge/Hosting-Azure%20Kubernetes%20Service-orange?logo=azure-devops)

- ![Azure DevOps](https://img.shields.io/badge/CI%2FCD-Azure%20DevOps-blue?logo=azure-pipelines)

- ![Terraform](https://img.shields.io/badge/IaC-Terraform-lightgrey?logo=terraform)

- ![React.js](https://img.shields.io/badge/Frontend-React.js-blue?logo=react)

- ![Express.js](https://img.shields.io/badge/Backend-Express.js-green?logo=node.js)

- ![Azure Cosmos DB](https://img.shields.io/badge/Backend-Azure%20Cosmos%20DB-green?logo=microsoft-azure)

- ![Auth0](https://img.shields.io/badge/Authentication-Auth0-yellow?logo=auth0)


Add architecture image here

### Azure Kubernetes Services with Docker
Utilizing containerization technology via Docker, FitTracker's microservice architecture guarantees both portability and scalability. By leveraging Azure Kubernetes Services (AKS), I configured all deployments to operate in a cost-effective manner by constraining container scaling.

### CI/CD Pipelines with Azure DevOps
Using Azure DevOps, FitTracker's CI/CD pipelines automate the build, test, and deployment processes, enhancing development efficiency and ensuring rapid delivery of updates.

The pipeline builds docker images and publishes them in Azure Container Registry. Image secrets are created to pull images from ACR, which are used by Kubernetes manifests to allow deployment in the cluster.

### Secure secrets with Azure Key Vault
FitTracker employes Azure Key Vault (AKV) to safeguard sensitive information and ensure data integrity.

To achieve this, FitTracker leverages the Secrets Store CSI Driver in Azure Kubernetes Service (AKS), which enables the mounting of secrets, keys, or certificates to pods using volumes. This mechanism ensures secure access to sensitive data within the application environment. 

To further enhance security, a new service account was provisioned, attaching a federated identity to Azure Key Vault. This service account is utilized by the CSI Driver to synchronize secrets with Azure Key Vault, maintaining robust security measures throughout the application lifecycle.

For more detailed insights into the implementation steps, you can explore the documentation provided [here](https://learn.microsoft.com/en-us/azure/aks/csi-secrets-store-identity-access).

### Store data with Cosmos NoSQL DB
When configuring the database for FitTracker, factors such as costs, scalability, and maintenance effort were pivotal considerations. Azure Cosmos DB was the optimal choice due to its ability to streamline development efforts while offering a simplified API.

The inclusion of Azure Cosmos DB significantly expedited the development process, allowing for efficient database management with its user-friendly interface. Additionally, the availability of a free tier option, limited to 1000 Request Units (RU) and the first 10 GB of storage free of charge helped minimizing operational costs.

By using Azure Cosmos DB, there is also a reduced maintenance overhead and a scalability option to accommodate future growth, making it a cost-effective and scalable solution for database management.

### Available to public securely via Azure DNS and HTTPS
This project maximizes accessibility through the seamless integration of Azure DNS, Ingress controllers, and managed identities, ensuring easy access via  [our website](https://eappui.myprojectsdomain.net/).

Azure DNS is configured to host the project's domain, establishing a vital connection with the virtual machine scale sets (VMSS) of the AKS cluster through managed identities.

Helm Charts are used for the installation of both an External DNS and an Ingress controller. The ingress controller acts as an API gateway, efficiently routes all incoming traffic to our various internal services within the cluster. Simultaneously, the external DNS component allows connectivity between the ingress and the domain via Azure DNS, exposing the microservice to the public.

To ensure a secure experience, the FitTracker website is protected through HTTPS, powered by SSL provided by Let's Encrypt.

### IaC through Terraform
Employing infrastructure-as-code principles, FitTracker provisions essential resources within the Azure environment. These include:

- **AKS Cluster**: Azure Kubernetes Service (AKS) facilitates the management, scaling, and deployment of containerized applications, ensuring optimal performance and resource utilization.
  
- **Resource Groups**: Organized collections of Azure resources, resource groups streamline management and provide a logical grouping for related services, enhancing efficiency and organization.

- **Managed Identities**: Ensuring secure access to Azure resources, managed identities enable seamless authentication and authorization within the Azure ecosystem, bolstering overall security and compliance measures.


## Features

- **Easy Sign-Up**: FitTracker offers a hassle-free sign-up process, allowing users to quickly get started on their fitness journey, powered by Auth0.
  
- **Versatile Workout Tracking**: From treadmill runs to weightlifting sessions, FitTracker accommodates various workout activities, enabling users to log and monitor their progress effortlessly.
  
- **Visual Progress**: Users can visualize their workout data through intuitive graphs, providing valuable insights to keep them motivated.
  
- **DevOps Integration**: FitTracker leverages modern DevOps practices for seamless deployment, ensuring reliability and efficiency in its operation.

## Getting Started

To try out FitTracker, simply [click here](https://eappui.myprojectsdomain.net/) to access the application. Developers interested in contributing to the project are welcome to contact me and create a pull request with their ideas and/or bug fixes. However, all pull requests will have to be approved by me.


## Conclusion

FitTracker offers a user-friendly solution for tracking fitness progress, free from unnecessary complexities. Whether you're a seasoned fitness enthusiast or just starting out, FitTracker is here to support your journey to a healthier lifestyle.
