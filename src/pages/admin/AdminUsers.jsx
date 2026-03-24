// Adicione no estado
const [showInviteForm, setShowInviteForm] = useState(false);
const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    role: 'colaborador',
    department: ''
});

// Função para enviar convite
const handleInvite = async (e) => {
    e.preventDefault();
    try {
        await api.post('/admin/users/invite', inviteData);
        alert('Convite enviado com sucesso!');
        setShowInviteForm(false);
        setInviteData({ name: '', email: '', role: 'colaborador', department: '' });
        loadUsers();
    } catch (error) {
        alert(error.response?.data?.error || 'Erro ao enviar convite');
    }
};

// No JSX, adicione um segundo botão no header:
<div className="flex space-x-3">
    <button
        onClick={() => {
            resetForm();
            setShowForm(true);
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
        + Novo Usuário (com senha)
    </button>
    <button
        onClick={() => setShowInviteForm(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
        📧 Convidar Usuário
    </button>
</div>

{/* Modal de Convite */}
{showInviteForm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${classes.card} rounded-lg p-6 w-96`}>
            <h3 className={`text-xl font-bold mb-4 ${classes.text}`}>
                Convidar Novo Usuário
            </h3>
            <p className={`text-sm mb-4 ${classes.text} opacity-70`}>
                O usuário receberá um email com um link para definir sua senha.
            </p>
            <form onSubmit={handleInvite} className="space-y-4">
                <div>
                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                        Nome *
                    </label>
                    <input
                        type="text"
                        className={`w-full p-2 border rounded ${classes.input}`}
                        value={inviteData.name}
                        onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                        Email *
                    </label>
                    <input
                        type="email"
                        className={`w-full p-2 border rounded ${classes.input}`}
                        value={inviteData.email}
                        onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                        Papel
                    </label>
                    <select
                        className={`w-full p-2 border rounded ${classes.input}`}
                        value={inviteData.role}
                        onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
                    >
                        <option value="colaborador">Colaborador</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-1 ${classes.text}`}>
                        Departamento
                    </label>
                    <select
                        className={`w-full p-2 border rounded ${classes.input}`}
                        value={inviteData.department}
                        onChange={(e) => setInviteData({...inviteData, department: e.target.value})}
                    >
                        <option value="">Selecione...</option>
                        <option value="recepcao">Recepção</option>
                        <option value="governanca">Governança</option>
                        <option value="manutencao">Manutenção</option>
                        <option value="financeiro">Financeiro</option>
                        <option value="marketing">Marketing</option>
                    </select>
                </div>

                <div className="flex space-x-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Enviar Convite
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowInviteForm(false)}
                        className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
)}