resource "kubernetes_ingress" "winter_project_ingress" {
  metadata {
    name = "winter-project-ingress"
  }

  spec {
    backend {
      service_name = "app1-winter"
      service_port = 60
    }

    rule {
      http {
        path {
          backend {
            service_name = "app1-winter"
            service_port = 60
          }

          path = "/api/*"
        }

        path {
          backend {
            service_name = "app1-winter-frontend"
            service_port = 90
          }

          path = "/page/*"
        }
      }
    }

    tls {
      secret_name = "tls-secret"
    }
  }
}

resource "kubernetes_service_v1" "app1-winter" {
  metadata {
    name = "app1-winter"
  }
  spec {
    selector = {
      app = "app1-winter"
    }
    session_affinity = "ClientIP"
    port {
      port        = 60
      target_port = 60
    }

    type = "NodePort"
  }
}

resource "kubernetes_service_v1" "app1-winter-frontend" {
  metadata {
    name = "app1-winter-frontend"
  }
  spec {
    selector = {
      app = "app1-winter-frontend"
    }
    session_affinity = "ClientIP"
    port {
      port        = 90
      target_port = 90
    }

    type = "NodePort"
  }
}

# resource "kubernetes_pod" "example" {
#   metadata {
#     name = "terraform-example"
#     labels = {
#       app = "myapp-1"
#     }
#   }

#   spec {
#     container {
#       image = "nginx:1.7.9"
#       name  = "example"

#       port {
#         container_port = 8080
#       }
#     }
#   }
# }

# resource "kubernetes_pod" "example2" {
#   metadata {
#     name = "terraform-example2"
#     labels = {
#       app = "myapp-2"
#     }
#   }

#   spec {
#     container {
#       image = "nginx:1.7.9"
#       name  = "example"

#       port {
#         container_port = 8080
#       }
#     }
#   }
# }