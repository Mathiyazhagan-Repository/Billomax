import AddDraft from "./Add_Draft.jsx";

export default function AddQuotation({ onNavigate }) {
  return <AddDraft mode="Quotation" onNavigate={onNavigate} />;
}