import AllSales from "./All_Sales.jsx";

export default function ListPOS({ onNavigate }) {
  return (
    <AllSales
      pageTitle="POS"
      listTitle="List POS"
      onAdd={() => onNavigate?.("POS")}
    />
  );
}