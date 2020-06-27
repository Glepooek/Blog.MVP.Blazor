using Blog.MVP.Blazor.SSR.Extensions;
using Blog.MVP.Blazor.SSR.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace Blog.MVP.Blazor.SSR.Services
{
    /// <summary>
    /// �������
    /// ��Ҫ������Http����Ļ�����װ
    /// </summary>
    public class BlogService : BaseService
    {
        /// <summary>
        /// ���캯��
        /// </summary>
        /// <param name="serviceProvider"></param>
        public BlogService(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        /// <summary>
        /// ��ȡȫ������
        /// </summary>
        /// <param name="types"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        public async Task<MessageModel<List<BlogArticle>>> GetBlogs(string types, int page = 1)
        {
            var httpClient = await SecurityHttpClientAsync();
            return await httpClient.GetFromJsonAsync<MessageModel<List<BlogArticle>>>($"/api/Blog/GetBlogsByTypesForMVP?types={types}&page={page}");
        }

        /// <summary>
        /// ��ȡ��������
        /// </summary>
        /// <param name="types"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        public async Task<MessageModel<BlogArticle>> GetBlogByIdForMVP(int id = 0)
        {
            var httpClient = await SecurityHttpClientAsync();
            return await httpClient.GetFromJsonAsync<MessageModel<BlogArticle>>($"/api/Blog/GetBlogByIdForMVP?id={id}");
        }

        /// <summary>
        /// ���²���
        /// </summary>
        /// <param name="blogArticle"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> UpdateBlog(BlogArticle blogArticle)
        {
            var httpClient = await SecurityHttpClientAsync();
            return await httpClient.PutAsJsonAsync("/api/Blog/Update", blogArticle);
        }

        /// <summary>
        /// ��Ӳ���
        /// </summary>
        /// <param name="blogArticle"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> AddForMVP(BlogArticle blogArticle)
        {
            var httpClient = await SecurityHttpClientAsync();
            return await httpClient.PostAsJsonAsync("/api/Blog/AddForMVP", blogArticle);
        }

    }
}
