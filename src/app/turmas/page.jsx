"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import AlertSucesso from "../components/AlertSucesso";

export default function ListarProdutos() {
  const router = useRouter();
  const [data, setData] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);

  // estados para carregar os valores do botão atualiza
  // armazenam somente o dado de 1 produto buscado pela funcao atualizarProdBtnEditar()
  
  const [nome, setNome] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [fprofessor, setProfessor] = useState("");

  // estados para alertas
  const [mostrarAlertaSucesso, setMostrarAlertaSucesso] = useState(false);

  const fetchData = async () => {
    try {
      const resposta = await axiosInstance.get("/turma/listar");
      setData(resposta.data);
    } catch (error) {
      if (error.response) {
        // A resposta do servidor foi recebida, mas contém erro (status code diferente de 2xx)
        console.error("Erro de resposta:", error.response.status);
      } else if (error.request) {
        // A requisição foi feita, mas nenhuma resposta foi recebida
        console.error("Erro de requisição:", error.request);
      } else {
        // Outro tipo de erro ocorreu
        console.error("Erro ao configurar requisição:", error.message);
      }
    }
  };



  useEffect(() => {
    fetchData();
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const removerTurma = async (id) => {
    try {
      const resposta = await axiosInstance.delete(`/turma/deletar/${id}`);
      alert("Turma deletada com sucesso", resposta);
      fetchData();
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      if (error.response) {
        // A resposta do servidor foi recebida, mas contém erro (status code diferente de 2xx)
        console.error("Erro de resposta:", error.response.status);
      } else if (error.request) {
        // A requisição foi feita, mas nenhuma resposta foi recebida
        console.error("Erro de requisição:", error.request);
      } else {
        // Outro tipo de erro ocorreu
        console.error("Erro ao configurar requisição:", error.message);
      }
    }
  };


  if (isLoading) {
    return (
      <div className="flex w-full md:w-[80%] m-auto items-center justify-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 w-full justify-center items-center m-auto">
          <span className="loading loading-dots loading-lg"></span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-screen-xl m-auto items-center justify-center justify-items-center min-h-screen px-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 w-full justify-center items-center m-auto">
        <div className=" flex justify-around w-full">
          <h1 className="text-4xl font-bold">Lista de Turmas</h1>
          <button
            onClick={() => {
              router.push("/turmas/cadastrar");
            }}
            className="btn btn-active btn-primary"
          >
            Cadastrar turmas
          </button>
        </div>
        <div className="overflow-x-auto w-full shadow-lg shadow-indigo-500/50 p-2 rounded-lg">
          <table className="table table-zebra text-center">
            {/* head */}
            <thead>
              <tr className="text-black font-bold text-base">
                <th>COD Turma</th>
                <th>Nome Turma</th>
                <th>Periodo</th>
                <th>Professor Responsavel</th>
              </tr>
            </thead>
            <tbody>
              {/* row  */}
              {data.map((turma, index) => (
                <tr key={index}>
                  <th>{turma.codTurma}</th>
                  <td>{turma.nome}</td>
                  <td>{turma.periodo}</td>
                  <td>{turma.professor.nome}</td>
                  <td>
                    <div className="flex items-center justify-center gap-5 my-2">
                      {/* MOLDAL EDITAR INICIO--------------------------- */}
                      <button
                        onClick={() => {
                          {
                            /* document.getElementById("my_modal_2").showModal();
                        atualizarProdBtnEditar(produto.id); */
                          }
                          router.push(`/turmas/${turma.codTurma}`);
                        }}
                        className="btn btn-info"
                      >
                        Editar
                      </button>

                      {/* MOLDAL EDITAR FIM--------------------------- */}
                      <button
                        onClick={() => removerTurma(turma.codTurma)}
                        className="btn btn-error"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-around mt-10">
            <Link href={"/"} className="hover:underline">
              Voltar a home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
