export default function Estatistica({ titulo, valor }) {
    return (
        <div className="estatistica">
            <span className="estatistica-titulo">{titulo}</span>
            <span className="estatistica-tracejado"></span>
            <strong className="estatistica-valor">{valor}</strong>
        </div>
    );
}
